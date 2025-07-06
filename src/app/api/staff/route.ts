import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/staff - Get all staff members
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const department = searchParams.get('department')
    const position = searchParams.get('position')
    const isActive = searchParams.get('isActive')

    const where: Prisma.StaffWhereInput = {}
    if (department) where.department = department
    if (position) where.position = { contains: position }
    if (isActive !== null) where.isActive = isActive === 'true'

    const staff = await prisma.staff.findMany({
      where,
      include: {
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error fetching staff:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/staff - Create new staff member
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      schoolId,
      employeeId,
      name,
      email,
      phone,
      position,
      department,
      salary,
      dateOfJoining,
      address,
    } = body

    // Validate required fields
    if (!schoolId || !employeeId || !name || !email || !phone || !position || !dateOfJoining || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if employee ID already exists
    const existingStaff = await prisma.staff.findUnique({
      where: { employeeId },
    })

    if (existingStaff) {
      return NextResponse.json({ error: 'Employee ID already exists' }, { status: 400 })
    }

    // Check if email already exists
    const existingEmail = await prisma.staff.findUnique({
      where: { email },
    })

    if (existingEmail) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const staff = await prisma.staff.create({
      data: {
        schoolId,
        employeeId,
        name,
        email,
        phone,
        position,
        department,
        salary: salary ? parseFloat(salary) : null,
        dateOfJoining: new Date(dateOfJoining),
        address,
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(staff, { status: 201 })
  } catch (error) {
    console.error('Error creating staff:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/staff - Update staff member
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      id,
      name,
      email,
      phone,
      position,
      department,
      salary,
      address,
      isActive,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 })
    }

    const updateData: Prisma.StaffUpdateInput = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (position !== undefined) updateData.position = position
    if (department !== undefined) updateData.department = department
    if (salary !== undefined) updateData.salary = salary ? parseFloat(salary) : null
    if (address !== undefined) updateData.address = address
    if (isActive !== undefined) updateData.isActive = isActive

    const staff = await prisma.staff.update({
      where: { id },
      data: updateData,
      include: {
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error updating staff:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/staff - Delete staff member
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 })
    }

    await prisma.staff.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Staff member deleted successfully' })
  } catch (error) {
    console.error('Error deleting staff:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
