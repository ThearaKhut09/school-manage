import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/operations/inventory - Get all inventory items
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')
    const lowStock = searchParams.get('lowStock')

    const where: Prisma.InventoryItemWhereInput = {}
    if (category) where.category = category
    if (isActive !== null) where.isActive = isActive === 'true'
    if (lowStock === 'true') where.quantity = { lte: 10 }

    const items = await prisma.inventoryItem.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching inventory items:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/operations/inventory - Create new inventory item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      category,
      quantity,
      unitPrice,
      supplier,
    } = body

    if (!name || !category || quantity === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        description,
        category,
        quantity: parseInt(quantity),
        unitPrice: unitPrice ? parseFloat(unitPrice) : null,
        supplier,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating inventory item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/operations/inventory - Update inventory item
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
      description,
      category,
      quantity,
      unitPrice,
      supplier,
      isActive,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    const updateData: Prisma.InventoryItemUpdateInput = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category
    if (quantity !== undefined) updateData.quantity = parseInt(quantity)
    if (unitPrice !== undefined) updateData.unitPrice = unitPrice ? parseFloat(unitPrice) : null
    if (supplier !== undefined) updateData.supplier = supplier
    if (isActive !== undefined) updateData.isActive = isActive

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating inventory item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/operations/inventory - Delete inventory item
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    await prisma.inventoryItem.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Inventory item deleted successfully' })
  } catch (error) {
    console.error('Error deleting inventory item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
