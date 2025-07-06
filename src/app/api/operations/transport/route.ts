import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/operations/transport - Get all buses
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const isActive = searchParams.get('isActive')
    const route = searchParams.get('route')

    const where: Prisma.BusWhereInput = {}
    if (isActive !== null) where.isActive = isActive === 'true'
    if (route) where.route = { contains: route }

    const buses = await prisma.bus.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(buses)
  } catch (error) {
    console.error('Error fetching buses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/operations/transport - Create new bus
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      busNumber,
      driverName,
      driverPhone,
      route,
      capacity,
    } = body

    if (!busNumber || !driverName || !driverPhone || !route || !capacity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if bus number already exists
    const existingBus = await prisma.bus.findUnique({
      where: { busNumber },
    })

    if (existingBus) {
      return NextResponse.json({ error: 'Bus number already exists' }, { status: 400 })
    }

    const bus = await prisma.bus.create({
      data: {
        busNumber,
        driverName,
        driverPhone,
        route,
        capacity: parseInt(capacity),
      },
    })

    return NextResponse.json(bus, { status: 201 })
  } catch (error) {
    console.error('Error creating bus:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/operations/transport - Update bus
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      id,
      driverName,
      driverPhone,
      route,
      capacity,
      isActive,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Bus ID is required' }, { status: 400 })
    }

    const updateData: Prisma.BusUpdateInput = {}
    if (driverName !== undefined) updateData.driverName = driverName
    if (driverPhone !== undefined) updateData.driverPhone = driverPhone
    if (route !== undefined) updateData.route = route
    if (capacity !== undefined) updateData.capacity = parseInt(capacity)
    if (isActive !== undefined) updateData.isActive = isActive

    const bus = await prisma.bus.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(bus)
  } catch (error) {
    console.error('Error updating bus:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/operations/transport - Delete bus
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Bus ID is required' }, { status: 400 })
    }

    await prisma.bus.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Bus deleted successfully' })
  } catch (error) {
    console.error('Error deleting bus:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
