import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      totalSubjects,
      recentAttendance,
      upcomingAssignments,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.class.count(),
      prisma.subject.count(),
      prisma.attendance.findMany({
        where: {
          date: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        },
        include: {
          student: {
            include: {
              user: true
            }
          }
        },
        orderBy: {
          date: "desc"
        },
        take: 10
      }),
      prisma.assignment.findMany({
        where: {
          dueDate: {
            gte: new Date()
          }
        },
        include: {
          subject: true,
        },
        orderBy: {
          dueDate: "asc"
        },
        take: 5
      }),
    ]);

    // Calculate attendance statistics
    const attendanceStats = await prisma.attendance.groupBy({
      by: ["status"],
      where: {
        date: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      },
      _count: {
        status: true
      }
    });

    const attendanceRate = attendanceStats.reduce((acc, stat) => {
      if (stat.status === "PRESENT") {
        acc.present = stat._count.status;
      } else if (stat.status === "ABSENT") {
        acc.absent = stat._count.status;
      }
      return acc;
    }, { present: 0, absent: 0 });

    const totalAttendanceRecords = attendanceRate.present + attendanceRate.absent;
    const attendancePercentage = totalAttendanceRecords > 0 
      ? (attendanceRate.present / totalAttendanceRecords) * 100 
      : 0;

    return NextResponse.json({
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalSubjects,
        attendanceRate: Math.round(attendancePercentage)
      },
      recentAttendance,
      upcomingAssignments,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
