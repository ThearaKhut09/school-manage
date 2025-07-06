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
    const subjectId = url.searchParams.get("subjectId");
    const status = url.searchParams.get("status");

    const offset = (page - 1) * limit;

    const where = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } }
          ]
        } : {},
        subjectId ? { subjectId } : {},
        status ? {
          dueDate: status === "upcoming" 
            ? { gte: new Date() }
            : status === "overdue"
            ? { lt: new Date() }
            : undefined
        } : {}
      ]
    };

    const [assignments, total] = await Promise.all([
      prisma.assignment.findMany({
        where,
        include: {
          teacher: {
            include: {
              user: true
            }
          },
          subject: true,
          submissions: {
            include: {
              student: {
                include: {
                  user: true
                }
              }
            }
          },
          _count: {
            select: {
              submissions: true
            }
          }
        },
        skip: offset,
        take: limit,
        orderBy: {
          dueDate: "asc"
        }
      }),
      prisma.assignment.count({ where })
    ]);

    return NextResponse.json({
      assignments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "TEACHER"].includes((session.user as SessionUser)?.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const {
      title,
      description,
      subjectId,
      teacherId,
      dueDate,
      maxMarks = 100,
      instructions,
      attachments = []
    } = data;

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        subjectId,
        teacherId,
        dueDate: new Date(dueDate),
        maxMarks,
        instructions,
        attachments
      },
      include: {
        teacher: {
          include: {
            user: true
          }
        },
        subject: true
      }
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
