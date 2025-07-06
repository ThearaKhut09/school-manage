import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/parents - Get all parents
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const isActive = searchParams.get('isActive')

    const where: Prisma.ParentWhereInput = {}
    if (isActive !== null) where.isActive = isActive === 'true'

    const parents = await prisma.parent.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        students: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
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
        createdAt: 'desc',
      },
    })

    return NextResponse.json(parents)
  } catch (error) {
    console.error('Error fetching parents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/parents - Create new parent
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      userId,
      fatherName,
      motherName,
      occupation,
      phone,
      address,
      relationship,
      studentIds,
    } = body

    if (!userId || !phone || !address || !relationship) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const parent = await prisma.parent.create({
      data: {
        userId,
        fatherName,
        motherName,
        occupation,
        phone,
        address,
        relationship,
        students: studentIds ? {
          create: studentIds.map((studentId: string) => ({
            studentId,
          })),
        } : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        students: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(parent, { status: 201 })
  } catch (error) {
    console.error('Error creating parent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/parents - Update parent
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      id,
      fatherName,
      motherName,
      occupation,
      phone,
      address,
      relationship,
      isActive,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Parent ID is required' }, { status: 400 })
    }

    const updateData: Prisma.ParentUpdateInput = {}
    if (fatherName !== undefined) updateData.fatherName = fatherName
    if (motherName !== undefined) updateData.motherName = motherName
    if (occupation !== undefined) updateData.occupation = occupation
    if (phone !== undefined) updateData.phone = phone
    if (address !== undefined) updateData.address = address
    if (relationship !== undefined) updateData.relationship = relationship
    if (isActive !== undefined) updateData.isActive = isActive

    const parent = await prisma.parent.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        students: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(parent)
  } catch (error) {
    console.error('Error updating parent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/parents - Delete parent
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Parent ID is required' }, { status: 400 })
    }

    await prisma.parent.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Parent deleted successfully' })
  } catch (error) {
    console.error('Error deleting parent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
