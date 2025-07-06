import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/exams - Get all exams
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const subjectId = searchParams.get('subjectId')
    const examType = searchParams.get('examType')
    const isActive = searchParams.get('isActive')

    const where: Prisma.ExamWhereInput = {}
    if (subjectId) where.subjectId = subjectId
    if (examType) where.examType = examType as Prisma.ExamType
    if (isActive !== null) where.isActive = isActive === 'true'

    const exams = await prisma.exam.findMany({
      where,
      include: {
        subject: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        results: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                class: {
                  select: {
                    id: true,
                    name: true,
                    section: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        examDate: 'desc',
      },
    })

    return NextResponse.json(exams)
  } catch (error) {
    console.error('Error fetching exams:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/exams - Create new exam
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      subjectId,
      title,
      description,
      examDate,
      startTime,
      endTime,
      maxMarks,
      passingMarks,
      examType,
    } = body

    if (!subjectId || !title || !examDate || !startTime || !endTime || !maxMarks || !examType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const exam = await prisma.exam.create({
      data: {
        subjectId,
        title,
        description,
        examDate: new Date(examDate),
        startTime,
        endTime,
        maxMarks: parseInt(maxMarks),
        passingMarks: passingMarks ? parseInt(passingMarks) : 40,
        examType,
      },
      include: {
        subject: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(exam, { status: 201 })
  } catch (error) {
    console.error('Error creating exam:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/exams - Update exam
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      id,
      title,
      description,
      examDate,
      startTime,
      endTime,
      maxMarks,
      passingMarks,
      examType,
      isActive,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Exam ID is required' }, { status: 400 })
    }

    const updateData: Prisma.ExamUpdateInput = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (examDate !== undefined) updateData.examDate = new Date(examDate)
    if (startTime !== undefined) updateData.startTime = startTime
    if (endTime !== undefined) updateData.endTime = endTime
    if (maxMarks !== undefined) updateData.maxMarks = parseInt(maxMarks)
    if (passingMarks !== undefined) updateData.passingMarks = parseInt(passingMarks)
    if (examType !== undefined) updateData.examType = examType
    if (isActive !== undefined) updateData.isActive = isActive

    const exam = await prisma.exam.update({
      where: { id },
      data: updateData,
      include: {
        subject: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(exam)
  } catch (error) {
    console.error('Error updating exam:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/exams - Delete exam
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Exam ID is required' }, { status: 400 })
    }

    await prisma.exam.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Exam deleted successfully' })
  } catch (error) {
    console.error('Error deleting exam:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
