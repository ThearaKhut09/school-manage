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

// GET - Get all subject-class-teacher assignments
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const classId = url.searchParams.get("classId");
    const subjectId = url.searchParams.get("subjectId");
    const teacherId = url.searchParams.get("teacherId");

    const where: {
      classId?: string;
      subjectId?: string;
      teacherId?: string;
    } = {};
    
    if (classId) where.classId = classId;
    if (subjectId) where.subjectId = subjectId;
    if (teacherId) where.teacherId = teacherId;

    const assignments = await prisma.classSubject.findMany({
      where,
      include: {
        class: {
          include: {
            school: true,
            academicYear: true
          }
        },
        subject: true,
        teacher: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error("Error fetching subject assignments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new subject-class-teacher assignment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as SessionUser)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const { classId, subjectId, teacherId } = data;

    // Validate required fields
    if (!classId || !subjectId || !teacherId) {
      return NextResponse.json(
        { error: "Class ID, Subject ID, and Teacher ID are required" },
        { status: 400 }
      );
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.classSubject.findFirst({
      where: {
        classId,
        subjectId
      }
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: "Subject is already assigned to this class" },
        { status: 409 }
      );
    }

    // Verify that class, subject, and teacher exist
    const [classExists, subjectExists, teacherExists] = await Promise.all([
      prisma.class.findUnique({ where: { id: classId } }),
      prisma.subject.findUnique({ where: { id: subjectId } }),
      prisma.teacher.findUnique({ where: { id: teacherId } })
    ]);

    if (!classExists) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    if (!subjectExists) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    if (!teacherExists) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    const assignment = await prisma.classSubject.create({
      data: {
        classId,
        subjectId,
        teacherId
      },
      include: {
        class: {
          include: {
            school: true,
            academicYear: true
          }
        },
        subject: true,
        teacher: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("Error creating subject assignment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a subject-class-teacher assignment
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as SessionUser)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const { id, teacherId } = data;

    if (!id || !teacherId) {
      return NextResponse.json(
        { error: "Assignment ID and Teacher ID are required" },
        { status: 400 }
      );
    }

    // Check if assignment exists
    const existingAssignment = await prisma.classSubject.findUnique({
      where: { id }
    });

    if (!existingAssignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    // Verify teacher exists
    const teacherExists = await prisma.teacher.findUnique({
      where: { id: teacherId }
    });

    if (!teacherExists) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    const assignment = await prisma.classSubject.update({
      where: { id },
      data: { teacherId },
      include: {
        class: {
          include: {
            school: true,
            academicYear: true
          }
        },
        subject: true,
        teacher: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Error updating subject assignment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a subject-class-teacher assignment
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as SessionUser)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
    }

    // Check if assignment exists
    const existingAssignment = await prisma.classSubject.findUnique({
      where: { id }
    });

    if (!existingAssignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    await prisma.classSubject.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject assignment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
