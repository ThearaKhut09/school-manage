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
    const studentId = url.searchParams.get("studentId");
    const subjectId = url.searchParams.get("subjectId");
    const examId = url.searchParams.get("examId");

    const where = {
      AND: [
        studentId ? { studentId } : {},
        examId ? { examId } : {},
        subjectId ? { exam: { subjectId } } : {}
      ]
    };

    const grades = await prisma.examResult.findMany({
      where,
      include: {
        student: {
          include: {
            user: true,
            class: true
          }
        },
        exam: {
          include: {
            subject: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Calculate statistics
    const stats = {
      totalGrades: grades.length,
      averageMarks: grades.length > 0 
        ? grades.reduce((sum, grade) => sum + grade.marksObtained, 0) / grades.length
        : 0,
      passRate: grades.length > 0
        ? (grades.filter(grade => grade.marksObtained >= (grade.exam.totalMarks * 0.6)).length / grades.length) * 100
        : 0
    };

    return NextResponse.json({
      grades,
      stats
    });
  } catch (error) {
    console.error("Error fetching grades:", error);
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
      examId,
      studentId,
      marksObtained,
      grade,
      remarks,
      isAbsent = false
    } = data;

    const examResult = await prisma.examResult.create({
      data: {
        examId,
        studentId,
        marksObtained,
        grade,
        remarks,
        isAbsent
      },
      include: {
        student: {
          include: {
            user: true
          }
        },
        exam: {
          include: {
            subject: true
          }
        }
      }
    });

    return NextResponse.json(examResult, { status: 201 });
  } catch (error) {
    console.error("Error creating grade:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
