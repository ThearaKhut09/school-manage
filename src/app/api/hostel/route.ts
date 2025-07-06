import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock hostel data
const mockHostels = [
  {
    id: 1,
    name: 'Boys Hostel A',
    type: 'boys',
    capacity: 100,
    occupied: 85,
    warden: 'Mr. John Smith',
    contact: '+1234567890',
    address: '123 Campus Road, University Area',
    facilities: ['WiFi', 'Laundry', 'Recreation Room', 'Study Hall', 'Cafeteria'],
    status: 'active'
  },
  {
    id: 2,
    name: 'Girls Hostel B',
    type: 'girls',
    capacity: 80,
    occupied: 72,
    warden: 'Ms. Jane Doe',
    contact: '+1234567891',
    address: '456 Campus Road, University Area',
    facilities: ['WiFi', 'Laundry', 'Recreation Room', 'Study Hall', 'Cafeteria', 'Gym'],
    status: 'active'
  },
  {
    id: 3,
    name: 'International Hostel',
    type: 'mixed',
    capacity: 120,
    occupied: 95,
    warden: 'Dr. Robert Johnson',
    contact: '+1234567892',
    address: '789 Campus Road, University Area',
    facilities: ['WiFi', 'Laundry', 'Recreation Room', 'Study Hall', 'Cafeteria', 'Conference Room'],
    status: 'active'
  }
]

const mockRooms = [
  {
    id: 1,
    hostelId: 1,
    hostelName: 'Boys Hostel A',
    roomNumber: 'A101',
    type: 'single',
    capacity: 1,
    occupied: 1,
    floor: 1,
    rent: 500,
    facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan'],
    status: 'occupied'
  },
  {
    id: 2,
    hostelId: 1,
    hostelName: 'Boys Hostel A',
    roomNumber: 'A102',
    type: 'double',
    capacity: 2,
    occupied: 2,
    floor: 1,
    rent: 400,
    facilities: ['Beds', 'Study Tables', 'Wardrobes', 'Fan'],
    status: 'occupied'
  },
  {
    id: 3,
    hostelId: 1,
    hostelName: 'Boys Hostel A',
    roomNumber: 'A103',
    type: 'single',
    capacity: 1,
    occupied: 0,
    floor: 1,
    rent: 500,
    facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan'],
    status: 'available'
  },
  {
    id: 4,
    hostelId: 2,
    hostelName: 'Girls Hostel B',
    roomNumber: 'B201',
    type: 'double',
    capacity: 2,
    occupied: 1,
    floor: 2,
    rent: 450,
    facilities: ['Beds', 'Study Tables', 'Wardrobes', 'Fan', 'Balcony'],
    status: 'partially_occupied'
  },
  {
    id: 5,
    hostelId: 2,
    hostelName: 'Girls Hostel B',
    roomNumber: 'B202',
    type: 'triple',
    capacity: 3,
    occupied: 3,
    floor: 2,
    rent: 350,
    facilities: ['Beds', 'Study Tables', 'Wardrobes', 'Fan'],
    status: 'occupied'
  }
]

const mockStudents = [
  {
    id: 1,
    studentId: 'ST001',
    name: 'John Smith',
    email: 'john@school.com',
    phone: '+1234567890',
    hostelId: 1,
    hostelName: 'Boys Hostel A',
    roomId: 1,
    roomNumber: 'A101',
    checkInDate: '2024-01-01',
    checkOutDate: null,
    status: 'active',
    emergencyContact: {
      name: 'Robert Smith',
      phone: '+1234567899',
      relation: 'Father'
    },
    feeStatus: 'paid',
    lastPayment: '2024-01-01',
    monthlyRent: 500
  },
  {
    id: 2,
    studentId: 'ST002',
    name: 'Jane Doe',
    email: 'jane@school.com',
    phone: '+1234567891',
    hostelId: 2,
    hostelName: 'Girls Hostel B',
    roomId: 4,
    roomNumber: 'B201',
    checkInDate: '2024-01-05',
    checkOutDate: null,
    status: 'active',
    emergencyContact: {
      name: 'Mary Doe',
      phone: '+1234567898',
      relation: 'Mother'
    },
    feeStatus: 'pending',
    lastPayment: '2023-12-01',
    monthlyRent: 450
  },
  {
    id: 3,
    studentId: 'ST003',
    name: 'Bob Johnson',
    email: 'bob@school.com',
    phone: '+1234567892',
    hostelId: 1,
    hostelName: 'Boys Hostel A',
    roomId: 2,
    roomNumber: 'A102',
    checkInDate: '2024-01-03',
    checkOutDate: null,
    status: 'active',
    emergencyContact: {
      name: 'Alice Johnson',
      phone: '+1234567897',
      relation: 'Mother'
    },
    feeStatus: 'paid',
    lastPayment: '2024-01-01',
    monthlyRent: 400
  }
]

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'hostels'
    const search = searchParams.get('search')
    const hostelId = searchParams.get('hostelId')
    const status = searchParams.get('status')

    if (type === 'hostels') {
      let filteredHostels = mockHostels

      if (search) {
        filteredHostels = filteredHostels.filter(hostel =>
          hostel.name.toLowerCase().includes(search.toLowerCase()) ||
          hostel.warden.toLowerCase().includes(search.toLowerCase())
        )
      }

      if (status) {
        filteredHostels = filteredHostels.filter(hostel => hostel.status === status)
      }

      return NextResponse.json({
        hostels: filteredHostels,
        total: filteredHostels.length,
        stats: {
          totalHostels: mockHostels.length,
          totalCapacity: mockHostels.reduce((sum, hostel) => sum + hostel.capacity, 0),
          totalOccupied: mockHostels.reduce((sum, hostel) => sum + hostel.occupied, 0),
          occupancyRate: Math.round((mockHostels.reduce((sum, hostel) => sum + hostel.occupied, 0) / mockHostels.reduce((sum, hostel) => sum + hostel.capacity, 0)) * 100)
        }
      })
    } else if (type === 'rooms') {
      let filteredRooms = mockRooms

      if (hostelId) {
        filteredRooms = filteredRooms.filter(room => room.hostelId === parseInt(hostelId))
      }

      if (search) {
        filteredRooms = filteredRooms.filter(room =>
          room.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
          room.hostelName.toLowerCase().includes(search.toLowerCase())
        )
      }

      if (status) {
        filteredRooms = filteredRooms.filter(room => room.status === status)
      }

      return NextResponse.json({
        rooms: filteredRooms,
        total: filteredRooms.length,
        stats: {
          totalRooms: mockRooms.length,
          availableRooms: mockRooms.filter(room => room.status === 'available').length,
          occupiedRooms: mockRooms.filter(room => room.status === 'occupied').length,
          partiallyOccupiedRooms: mockRooms.filter(room => room.status === 'partially_occupied').length
        }
      })
    } else if (type === 'students') {
      let filteredStudents = mockStudents

      if (hostelId) {
        filteredStudents = filteredStudents.filter(student => student.hostelId === parseInt(hostelId))
      }

      if (search) {
        filteredStudents = filteredStudents.filter(student =>
          student.name.toLowerCase().includes(search.toLowerCase()) ||
          student.studentId.toLowerCase().includes(search.toLowerCase()) ||
          student.email.toLowerCase().includes(search.toLowerCase())
        )
      }

      if (status) {
        filteredStudents = filteredStudents.filter(student => student.status === status)
      }

      return NextResponse.json({
        students: filteredStudents,
        total: filteredStudents.length,
        stats: {
          totalStudents: mockStudents.length,
          activeStudents: mockStudents.filter(student => student.status === 'active').length,
          pendingPayments: mockStudents.filter(student => student.feeStatus === 'pending').length,
          totalRevenue: mockStudents.reduce((sum, student) => sum + student.monthlyRent, 0)
        }
      })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching hostel data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hostel data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, ...data } = body

    if (type === 'hostel') {
      const newHostel = {
        id: mockHostels.length + 1,
        ...data,
        occupied: 0,
        status: 'active'
      }

      mockHostels.push(newHostel)
      return NextResponse.json(newHostel, { status: 201 })
    } else if (type === 'room') {
      const newRoom = {
        id: mockRooms.length + 1,
        ...data,
        occupied: 0,
        status: 'available'
      }

      mockRooms.push(newRoom)
      return NextResponse.json(newRoom, { status: 201 })
    } else if (type === 'student') {
      const { roomId, ...studentData } = data
      
      const room = mockRooms.find(r => r.id === roomId)
      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 })
      }

      if (room.occupied >= room.capacity) {
        return NextResponse.json({ error: 'Room is full' }, { status: 400 })
      }

      const newStudent = {
        id: mockStudents.length + 1,
        ...studentData,
        roomId,
        roomNumber: room.roomNumber,
        hostelId: room.hostelId,
        hostelName: room.hostelName,
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: null,
        status: 'active',
        monthlyRent: room.rent
      }

      mockStudents.push(newStudent)
      
      // Update room occupancy
      room.occupied += 1
      if (room.occupied >= room.capacity) {
        room.status = 'occupied'
      } else {
        room.status = 'partially_occupied'
      }

      // Update hostel occupancy
      const hostel = mockHostels.find(h => h.id === room.hostelId)
      if (hostel) {
        hostel.occupied += 1
      }

      return NextResponse.json(newStudent, { status: 201 })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Error creating hostel entry:', error)
    return NextResponse.json(
      { error: 'Failed to create hostel entry' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, id, ...data } = body

    if (type === 'hostel') {
      const index = mockHostels.findIndex(hostel => hostel.id === id)
      
      if (index === -1) {
        return NextResponse.json({ error: 'Hostel not found' }, { status: 404 })
      }

      mockHostels[index] = { ...mockHostels[index], ...data }
      return NextResponse.json(mockHostels[index])
    } else if (type === 'room') {
      const index = mockRooms.findIndex(room => room.id === id)
      
      if (index === -1) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 })
      }

      mockRooms[index] = { ...mockRooms[index], ...data }
      return NextResponse.json(mockRooms[index])
    } else if (type === 'student') {
      const index = mockStudents.findIndex(student => student.id === id)
      
      if (index === -1) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
      }

      mockStudents[index] = { ...mockStudents[index], ...data }
      return NextResponse.json(mockStudents[index])
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Error updating hostel entry:', error)
    return NextResponse.json(
      { error: 'Failed to update hostel entry' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      )
    }

    if (type === 'hostel') {
      const index = mockHostels.findIndex(hostel => hostel.id === parseInt(id))
      
      if (index === -1) {
        return NextResponse.json({ error: 'Hostel not found' }, { status: 404 })
      }

      mockHostels.splice(index, 1)
      return NextResponse.json({ message: 'Hostel deleted successfully' })
    } else if (type === 'room') {
      const index = mockRooms.findIndex(room => room.id === parseInt(id))
      
      if (index === -1) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 })
      }

      mockRooms.splice(index, 1)
      return NextResponse.json({ message: 'Room deleted successfully' })
    } else if (type === 'student') {
      const index = mockStudents.findIndex(student => student.id === parseInt(id))
      
      if (index === -1) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
      }

      const student = mockStudents[index]
      
      // Update room occupancy
      const room = mockRooms.find(r => r.id === student.roomId)
      if (room) {
        room.occupied -= 1
        if (room.occupied === 0) {
          room.status = 'available'
        } else if (room.occupied < room.capacity) {
          room.status = 'partially_occupied'
        }
      }

      // Update hostel occupancy
      const hostel = mockHostels.find(h => h.id === student.hostelId)
      if (hostel) {
        hostel.occupied -= 1
      }

      mockStudents.splice(index, 1)
      return NextResponse.json({ message: 'Student checkout successful' })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Error deleting hostel entry:', error)
    return NextResponse.json(
      { error: 'Failed to delete hostel entry' },
      { status: 500 }
    )
  }
}
