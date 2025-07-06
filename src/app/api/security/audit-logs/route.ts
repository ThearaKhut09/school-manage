import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock audit log data
const mockAuditLogs = [
  {
    id: 1,
    userId: 'admin@school.com',
    action: 'LOGIN',
    resource: 'DASHBOARD',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2024-01-15T08:30:00Z',
    status: 'SUCCESS',
    details: 'User logged in successfully'
  },
  {
    id: 2,
    userId: 'teacher@school.com',
    action: 'UPDATE',
    resource: 'STUDENT_GRADES',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2024-01-15T09:15:00Z',
    status: 'SUCCESS',
    details: 'Updated grades for student ID: 123'
  },
  {
    id: 3,
    userId: 'admin@school.com',
    action: 'DELETE',
    resource: 'STUDENT_RECORD',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2024-01-15T10:00:00Z',
    status: 'SUCCESS',
    details: 'Deleted student record ID: 456'
  },
  {
    id: 4,
    userId: 'unauthorized@example.com',
    action: 'ACCESS_DENIED',
    resource: 'ADMIN_PANEL',
    ipAddress: '203.0.113.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2024-01-15T11:30:00Z',
    status: 'FAILED',
    details: 'Unauthorized access attempt to admin panel'
  }
]

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let filteredLogs = mockAuditLogs

    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action)
    }

    if (status) {
      filteredLogs = filteredLogs.filter(log => log.status === status)
    }

    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId.includes(userId))
    }

    if (startDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= new Date(startDate)
      )
    }

    if (endDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= new Date(endDate)
      )
    }

    return NextResponse.json({
      auditLogs: filteredLogs,
      total: filteredLogs.length,
      pagination: {
        page: 1,
        limit: 50,
        total: filteredLogs.length,
        totalPages: Math.ceil(filteredLogs.length / 50)
      }
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
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
    const { action, resource, details } = body

    const newLog = {
      id: mockAuditLogs.length + 1,
      userId: session.user?.email || 'unknown',
      action,
      resource,
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      details
    }

    mockAuditLogs.push(newLog)

    return NextResponse.json(newLog, { status: 201 })
  } catch (error) {
    console.error('Error creating audit log:', error)
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    )
  }
}
