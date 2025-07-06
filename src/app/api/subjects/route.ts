import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const classId = url.searchParams.get("classId");

    const offset = (page - 1) * limit;

    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search } },
            { code: { contains: search } },
            { description: { contains: search } }
          ]
        } : {},
        classId ? { 
          classes: { 
            some: { 
              classId: classId 
            } 
          } 
        } : {}
      ]
    };

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        include: {
          school: true,
          academicYear: true,
          classes: {
            include: {
              class: true,
              teacher: {
                include: {
                  user: true
                }
              }
            }
          },
          _count: {
            select: {
              assignments: true,
              exams: true
            }
          }
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      prisma.subject.count({ where })
    ]);

    return NextResponse.json({
      subjects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as SessionUser)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const {
      name,
      code,
      description,
      schoolId,
      academicYearId,
      credits,
      isActive = true
    } = data;

    // Validate required fields
    if (!name || !code || !schoolId || !academicYearId) {
      return NextResponse.json(
        { error: "Name, code, schoolId, and academicYearId are required" },
        { status: 400 }
      );
    }

    // Check for duplicate code
    const existingSubject = await prisma.subject.findFirst({
      where: {
        code,
        schoolId,
        academicYearId
      }
    });

    if (existingSubject) {
      return NextResponse.json(
        { error: "Subject code already exists for this school and academic year" },
        { status: 409 }
      );
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        code,
        description,
        schoolId,
        academicYearId,
        credits,
        isActive
      },
      include: {
        school: true,
        academicYear: true,
        classes: {
          include: {
            class: true,
            teacher: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as SessionUser)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const {
      id,
      name,
      code,
      description,
      schoolId,
      academicYearId,
      credits,
      isActive = true
    } = data;

    if (!id) {
      return NextResponse.json({ error: "Subject ID is required" }, { status: 400 });
    }

    // Check if subject exists
    const existingSubject = await prisma.subject.findUnique({
      where: { id }
    });

    if (!existingSubject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    // Check for duplicate code if it's being changed
    if (code && code !== existingSubject.code) {
      const duplicateSubject = await prisma.subject.findFirst({
        where: {
          code,
          schoolId: schoolId || existingSubject.schoolId,
          academicYearId: academicYearId || existingSubject.academicYearId,
          id: { not: id }
        }
      });

      if (duplicateSubject) {
        return NextResponse.json({ error: "Subject code already exists" }, { status: 409 });
      }
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        name,
        code,
        description,
        schoolId,
        academicYearId,
        credits,
        isActive
      },
      include: {
        school: true,
        academicYear: true,
        classes: {
          include: {
            class: true,
            teacher: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error("Error updating subject:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as SessionUser)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Subject ID is required" }, { status: 400 });
    }

    // Check if subject exists
    const existingSubject = await prisma.subject.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            assignments: true,
            exams: true,
            classes: true
          }
        }
      }
    });

    if (!existingSubject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    // Check if subject has dependencies
    if (existingSubject._count.assignments > 0 || 
        existingSubject._count.exams > 0 || 
        existingSubject._count.classes > 0) {
      return NextResponse.json(
        { error: "Cannot delete subject with existing assignments, exams, or class associations" },
        { status: 409 }
      );
    }

    await prisma.subject.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
