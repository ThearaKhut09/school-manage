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
    const searchParams = url.searchParams;
    const search = searchParams.get("search") || "";
    const classId = searchParams.get("classId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const where = {
      AND: [
        search ? {
          OR: [
            { user: { firstName: { contains: search } } },
            { user: { lastName: { contains: search } } },
            { user: { email: { contains: search } } },
            { admissionNo: { contains: search } },
            { rollNumber: { contains: search } }
          ]
        } : {},
        classId ? { classId: classId } : {}
      ]
    };

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          user: true,
          class: true
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      prisma.student.count({ where })
    ]);

    return NextResponse.json({
      students,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error fetching students:", error);
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
      dateOfBirth,
      gender,
      classId,
      address,
      guardianPhone,
    } = data;

    // Generate unique student ID
    const studentCount = await prisma.student.count();
    const studentId = `STU${String(studentCount + 1).padStart(4, '0')}`;

    // Create user account for student
    const user = await prisma.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        role: "STUDENT",
        password: "" // Will be set during first login
      }
    });

    // Create student record
    const student = await prisma.student.create({
      data: {
        admissionNo: studentId,
        userId: user.id,
        schoolId: "school-1", // Default school for now
        classId,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address,
        emergencyPhone: guardianPhone,
        phone: guardianPhone,
      },
      include: {
        user: true,
        class: true
      }
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
