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
    const classId = searchParams.get("classId");

    const where = {
      AND: [
        classId ? { classId: classId } : {},
      ]
    };

    const timetable = await prisma.timetable.findMany({
      where,
      include: {
        class: true,
        teacher: {
          include: {
            user: true
          }
        },
      },
      orderBy: [
        { day: "asc" },
        { startTime: "asc" }
      ]
    });

    return NextResponse.json(timetable);
  } catch (error) {
    console.error("Error fetching timetable:", error);
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
      classId,
      teacherId,
      day,
      period,
      startTime,
      endTime,
      roomNo
    } = data;

    // Check for conflicts
    const conflict = await prisma.timetable.findFirst({
      where: {
        AND: [
          { classId },
          { day },
          { period },
        ]
      }
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Time slot conflict detected" },
        { status: 400 }
      );
    }

    const timetableEntry = await prisma.timetable.create({
      data: {
        classId,
        teacherId,
        day,
        period,
        startTime,
        endTime,
        roomNo
      },
      include: {
        class: true,
        teacher: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(timetableEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating timetable entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
