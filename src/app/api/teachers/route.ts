import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

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
    const department = url.searchParams.get("department");
    const status = url.searchParams.get("status");

    const offset = (page - 1) * limit;

    const where = {
      AND: [
        search ? {
          OR: [
            { user: { firstName: { contains: search } } },
            { user: { lastName: { contains: search } } },
            { user: { email: { contains: search } } },
            { employeeId: { contains: search } }
          ]
        } : {},
        department ? { department } : {},
        status !== undefined ? { isActive: status === "active" } : {}
      ]
    };

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        include: {
          user: true,
          subjects: {
            include: {
              classes: true
            }
          },
          classes: true,
          timetables: {
            include: {
              class: true
            }
          },
          _count: {
            select: {
              subjects: true,
              assignments: true,
              classes: true
            }
          }
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      prisma.teacher.count({ where })
    ]);

    return NextResponse.json({
      teachers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
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
      firstName,
      lastName,
      email,
      phone,
      address,
      dateOfBirth,
      gender,
      qualification,
      experience,
      department,
      specialization,
      salary,
      joiningDate
    } = data;

    // Generate unique employee ID
    const teacherCount = await prisma.teacher.count();
    const employeeId = `TCH${String(teacherCount + 1).padStart(4, '0')}`;

    // Create user account for teacher
    const hashedPassword = await bcrypt.hash("teacher123", 10);
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        role: "TEACHER",
        password: hashedPassword
      }
    });

    // Create teacher record
    const teacher = await prisma.teacher.create({
      data: {
        employeeId,
        userId: user.id,
        schoolId: "school-1", // Default school for now
        phone,
        address,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        qualification,
        experience,
        department,
        specialization,
        salary,
        joiningDate: new Date(joiningDate),
        isActive: true
      },
      include: {
        user: true,
        subjects: true,
        classes: true
      }
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error("Error creating teacher:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
