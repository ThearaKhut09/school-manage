import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AttendanceRecord {
  studentId: string;
  date: string;
  status: string;
  remarks?: string;
}

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
    const classId = url.searchParams.get("classId");
    const date = url.searchParams.get("date");
    const fromDate = url.searchParams.get("fromDate");
    const toDate = url.searchParams.get("toDate");

    const where = {
      AND: [
        studentId ? { studentId } : {},
        classId ? { student: { classId } } : {},
        date ? { date: new Date(date) } : {},
        fromDate && toDate ? {
          date: {
            gte: new Date(fromDate),
            lte: new Date(toDate)
          }
        } : {}
      ]
    };

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          include: {
            user: true,
            class: true
          }
        }
      },
      orderBy: {
        date: "desc"
      }
    });

    // Calculate statistics
    const stats = {
      totalRecords: attendance.length,
      present: attendance.filter(a => a.status === "PRESENT").length,
      absent: attendance.filter(a => a.status === "ABSENT").length,
      late: attendance.filter(a => a.status === "LATE").length,
      attendanceRate: attendance.length > 0 
        ? (attendance.filter(a => a.status === "PRESENT").length / attendance.length) * 100
        : 0
    };

    return NextResponse.json({
      attendance,
      stats
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
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
    const { attendanceRecords } = data; // Array of attendance records

    // Bulk create attendance records
    const results = await Promise.all(
      attendanceRecords.map(async (record: AttendanceRecord) => {
        const { studentId, date, status, remarks } = record;
        
        // Check if attendance already exists for this student and date
        const existing = await prisma.attendance.findFirst({
          where: {
            studentId,
            date: new Date(date)
          }
        });

        if (existing) {
          // Update existing record
          return prisma.attendance.update({
            where: { id: existing.id },
            data: {
              status,
              remarks
            },
            include: {
              student: {
                include: {
                  user: true
                }
              }
            }
          });
        } else {
          // Create new record
          return prisma.attendance.create({
            data: {
              studentId,
              date: new Date(date),
              status,
              remarks
            },
            include: {
              student: {
                include: {
                  user: true
                }
              }
            }
          });
        }
      })
    );

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error("Error creating attendance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
