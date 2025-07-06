import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock permissions data
const mockPermissions = [
  {
    id: 1,
    roleId: 'admin',
    roleName: 'Administrator',
    permissions: [
      'dashboard.view',
      'students.view',
      'students.create',
      'students.edit',
      'students.delete',
      'teachers.view',
      'teachers.create',
      'teachers.edit',
      'teachers.delete',
      'academics.view',
      'academics.manage',
      'fees.view',
      'fees.manage',
      'operations.view',
      'operations.manage',
      'reports.view',
      'reports.generate',
      'admin.view',
      'admin.manage',
      'security.view',
      'security.manage'
    ]
  },
  {
    id: 2,
    roleId: 'teacher',
    roleName: 'Teacher',
    permissions: [
      'dashboard.view',
      'students.view',
      'students.edit',
      'academics.view',
      'academics.manage',
      'reports.view',
      'attendance.view',
      'attendance.mark',
      'grades.view',
      'grades.edit',
      'assignments.view',
      'assignments.create',
      'assignments.edit',
      'exams.view',
      'exams.create'
    ]
  },
  {
    id: 3,
    roleId: 'student',
    roleName: 'Student',
    permissions: [
      'dashboard.view',
      'profile.view',
      'profile.edit',
      'assignments.view',
      'grades.view',
      'attendance.view',
      'timetable.view',
      'fees.view',
      'events.view'
    ]
  },
  {
    id: 4,
    roleId: 'parent',
    roleName: 'Parent',
    permissions: [
      'dashboard.view',
      'student.view',
      'assignments.view',
      'grades.view',
      'attendance.view',
      'timetable.view',
      'fees.view',
      'fees.pay',
      'events.view',
      'communications.view',
      'meetings.book'
    ]
  },
  {
    id: 5,
    roleId: 'accountant',
    roleName: 'Accountant',
    permissions: [
      'dashboard.view',
      'fees.view',
      'fees.manage',
      'fees.reports',
      'reports.view',
      'reports.generate',
      'students.view'
    ]
  },
  {
    id: 6,
    roleId: 'librarian',
    roleName: 'Librarian',
    permissions: [
      'dashboard.view',
      'library.view',
      'library.manage',
      'books.view',
      'books.manage',
      'members.view',
      'members.manage',
      'reports.view'
    ]
  }
]

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const roleId = searchParams.get('roleId')

    let filteredPermissions = mockPermissions

    if (roleId) {
      filteredPermissions = filteredPermissions.filter(perm => perm.roleId === roleId)
    }

    return NextResponse.json({
      permissions: filteredPermissions,
      total: filteredPermissions.length
    })
  } catch (error) {
    console.error('Error fetching permissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
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
    const { roleId, roleName, permissions } = body

    const newPermission = {
      id: mockPermissions.length + 1,
      roleId,
      roleName,
      permissions
    }

    mockPermissions.push(newPermission)

    return NextResponse.json(newPermission, { status: 201 })
  } catch (error) {
    console.error('Error creating permissions:', error)
    return NextResponse.json(
      { error: 'Failed to create permissions' },
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
    const { id, roleId, roleName, permissions } = body

    const index = mockPermissions.findIndex(perm => perm.id === id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    mockPermissions[index] = {
      id,
      roleId,
      roleName,
      permissions
    }

    return NextResponse.json(mockPermissions[index])
  } catch (error) {
    console.error('Error updating permissions:', error)
    return NextResponse.json(
      { error: 'Failed to update permissions' },
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Permission ID is required' },
        { status: 400 }
      )
    }

    const index = mockPermissions.findIndex(perm => perm.id === parseInt(id))
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    mockPermissions.splice(index, 1)

    return NextResponse.json({ message: 'Permission deleted successfully' })
  } catch (error) {
    console.error('Error deleting permission:', error)
    return NextResponse.json(
      { error: 'Failed to delete permission' },
      { status: 500 }
    )
  }
}
