'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Phone,
  BarChart3,
} from 'lucide-react'

// Mock data for attendance
const mockAttendance = [
  {
    id: '1',
    studentName: 'Emma Johnson',
    studentId: 'STU001',
    rollNumber: '2024001',
    class: 'Grade 10-A',
    date: '2024-01-15',
    status: 'Present',
    timeIn: '08:30',
    timeOut: '15:30',
    subject: 'Mathematics',
    period: 'Period 1',
    teacher: 'Dr. Emily Johnson',
    remarks: '',
    parentNotified: true,
  },
  {
    id: '2',
    studentName: 'Michael Chen',
    studentId: 'STU002',
    rollNumber: '2024002',
    class: 'Grade 10-B',
    date: '2024-01-15',
    status: 'Absent',
    timeIn: null,
    timeOut: null,
    subject: 'English',
    period: 'Period 2',
    teacher: 'Ms. Sarah Williams',
    remarks: 'Sick leave',
    parentNotified: true,
  },
  {
    id: '3',
    studentName: 'Sarah Williams',
    studentId: 'STU003',
    rollNumber: '2024003',
    class: 'Grade 9-A',
    date: '2024-01-15',
    status: 'Present',
    timeIn: '08:25',
    timeOut: '15:35',
    subject: 'Science',
    period: 'Period 3',
    teacher: 'Dr. Michael Chen',
    remarks: '',
    parentNotified: false,
  },
  {
    id: '4',
    studentName: 'James Rodriguez',
    studentId: 'STU004',
    rollNumber: '2024004',
    class: 'Grade 11-A',
    date: '2024-01-15',
    status: 'Late',
    timeIn: '09:15',
    timeOut: '15:30',
    subject: 'History',
    period: 'Period 1',
    teacher: 'Mr. James Rodriguez',
    remarks: 'Arrived 45 minutes late',
    parentNotified: true,
  },
  {
    id: '5',
    studentName: 'Emily Davis',
    studentId: 'STU005',
    rollNumber: '2024005',
    class: 'Grade 12-A',
    date: '2024-01-15',
    status: 'Present',
    timeIn: '08:20',
    timeOut: '15:40',
    subject: 'Physics',
    period: 'Period 4',
    teacher: 'Dr. Robert Kim',
    remarks: '',
    parentNotified: false,
  },
]

// Mock attendance statistics by student
const mockStudentStats = [
  {
    studentId: 'STU001',
    studentName: 'Emma Johnson',
    class: 'Grade 10-A',
    totalDays: 20,
    presentDays: 19,
    absentDays: 1,
    lateDays: 0,
    attendanceRate: 95,
  },
  {
    studentId: 'STU002',
    studentName: 'Michael Chen',
    class: 'Grade 10-B',
    totalDays: 20,
    presentDays: 17,
    absentDays: 3,
    lateDays: 0,
    attendanceRate: 85,
  },
  {
    studentId: 'STU003',
    studentName: 'Sarah Williams',
    class: 'Grade 9-A',
    totalDays: 20,
    presentDays: 18,
    absentDays: 1,
    lateDays: 1,
    attendanceRate: 90,
  },
  {
    studentId: 'STU004',
    studentName: 'James Rodriguez',
    class: 'Grade 11-A',
    totalDays: 20,
    presentDays: 15,
    absentDays: 3,
    lateDays: 2,
    attendanceRate: 75,
  },
  {
    studentId: 'STU005',
    studentName: 'Emily Davis',
    class: 'Grade 12-A',
    totalDays: 20,
    presentDays: 20,
    absentDays: 0,
    lateDays: 0,
    attendanceRate: 100,
  },
]

export default function AttendancePage() {
  const [attendance] = useState(mockAttendance)
  const [studentStats] = useState(mockStudentStats)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedAttendance, setSelectedAttendance] = useState<typeof mockAttendance[0] | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [viewMode, setViewMode] = useState<'daily' | 'summary'>('daily')

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesClass = selectedClass === 'all' || record.class === selectedClass
    const matchesStatus = selectedStatus === 'all' || record.status.toLowerCase() === selectedStatus.toLowerCase()
    const matchesDate = !selectedDate || record.date === selectedDate
    
    return matchesSearch && matchesClass && matchesStatus && matchesDate
  })

  const filteredStats = studentStats.filter(stat => {
    const matchesSearch = stat.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stat.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesClass = selectedClass === 'all' || stat.class === selectedClass
    
    return matchesSearch && matchesClass
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-green-100 text-green-800'
      case 'absent':
        return 'bg-red-100 text-red-800'
      case 'late':
        return 'bg-yellow-100 text-yellow-800'
      case 'excused':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return <CheckCircle className="w-4 h-4" />
      case 'absent':
        return <XCircle className="w-4 h-4" />
      case 'late':
        return <Clock className="w-4 h-4" />
      case 'excused':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 85) return 'text-blue-600'
    if (rate >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAttendanceIcon = (rate: number) => {
    if (rate >= 85) return <TrendingUp className="w-4 h-4" />
    return <TrendingDown className="w-4 h-4" />
  }

  const calculateOverallStats = () => {
    const totalRecords = attendance.length
    const presentCount = attendance.filter(a => a.status === 'Present').length
    const absentCount = attendance.filter(a => a.status === 'Absent').length
    const lateCount = attendance.filter(a => a.status === 'Late').length
    const overallRate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0

    return {
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      overallRate,
    }
  }

  const overallStats = calculateOverallStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">Track and manage student attendance records</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.totalRecords}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.presentCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent Today</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.absentCount}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Rate</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.overallRate}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters & View
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'daily' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('daily')}
              >
                Daily View
              </Button>
              <Button
                variant={viewMode === 'summary' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('summary')}
              >
                Summary View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="Grade 9-A">Grade 9-A</SelectItem>
                <SelectItem value="Grade 10-A">Grade 10-A</SelectItem>
                <SelectItem value="Grade 10-B">Grade 10-B</SelectItem>
                <SelectItem value="Grade 11-A">Grade 11-A</SelectItem>
                <SelectItem value="Grade 12-A">Grade 12-A</SelectItem>
              </SelectContent>
            </Select>
            {viewMode === 'daily' && (
              <>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                  </SelectContent>
                </Select>
                <div>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </>
            )}
            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Daily Attendance View */}
      {viewMode === 'daily' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="w-5 h-5 mr-2" />
              Daily Attendance ({filteredAttendance.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAttendance.map(record => (
                <div key={record.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{record.studentName}</h3>
                        <Badge variant="outline">{record.studentId}</Badge>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1">{record.status}</span>
                        </Badge>
                        {record.parentNotified && (
                          <Badge variant="outline">
                            <Phone className="w-3 h-3 mr-1" />
                            Parent Notified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {record.class}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {record.date}
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {record.subject}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {record.period}
                        </span>
                      </div>
                      {record.remarks && (
                        <p className="text-sm text-gray-500 mt-1">
                          <strong>Remarks:</strong> {record.remarks}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-sm font-medium">Time In</div>
                        <div className="text-sm text-gray-600">{record.timeIn || 'N/A'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Time Out</div>
                        <div className="text-sm text-gray-600">{record.timeOut || 'N/A'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Teacher</div>
                        <div className="text-sm text-gray-600">{record.teacher}</div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedAttendance(record)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Record
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Notify Parent
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary View */}
      {viewMode === 'summary' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Attendance Summary ({filteredStats.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStats.map(stat => (
                <div key={stat.studentId} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{stat.studentName}</h3>
                        <Badge variant="outline">{stat.studentId}</Badge>
                        <Badge className={`${getAttendanceColor(stat.attendanceRate)} bg-opacity-10`}>
                          {stat.attendanceRate}%
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {stat.class}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {stat.totalDays} Total Days
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{stat.presentDays}</div>
                        <div className="text-sm text-gray-600">Present</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{stat.absentDays}</div>
                        <div className="text-sm text-gray-600">Absent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">{stat.lateDays}</div>
                        <div className="text-sm text-gray-600">Late</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold flex items-center ${getAttendanceColor(stat.attendanceRate)}`}>
                          {getAttendanceIcon(stat.attendanceRate)}
                          <span className="ml-1">{stat.attendanceRate}%</span>
                        </div>
                        <div className="text-sm text-gray-600">Rate</div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Report
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Contact Parent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Details Dialog */}
      <Dialog open={!!selectedAttendance} onOpenChange={() => setSelectedAttendance(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Attendance Details</DialogTitle>
            <DialogDescription>
              Detailed attendance information for {selectedAttendance?.studentName}
            </DialogDescription>
          </DialogHeader>
          {selectedAttendance && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedAttendance.studentName}</h3>
                  <p className="text-gray-600">{selectedAttendance.studentId} • {selectedAttendance.class}</p>
                </div>
                <Badge className={getStatusColor(selectedAttendance.status)}>
                  {getStatusIcon(selectedAttendance.status)}
                  <span className="ml-1">{selectedAttendance.status}</span>
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Session Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Date:</strong> {selectedAttendance.date}</p>
                    <p><strong>Subject:</strong> {selectedAttendance.subject}</p>
                    <p><strong>Period:</strong> {selectedAttendance.period}</p>
                    <p><strong>Teacher:</strong> {selectedAttendance.teacher}</p>
                    <p><strong>Time In:</strong> {selectedAttendance.timeIn || 'N/A'}</p>
                    <p><strong>Time Out:</strong> {selectedAttendance.timeOut || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Additional Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Status:</strong> {selectedAttendance.status}</p>
                    <p><strong>Parent Notified:</strong> {selectedAttendance.parentNotified ? 'Yes' : 'No'}</p>
                    <p><strong>Remarks:</strong> {selectedAttendance.remarks || 'None'}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setSelectedAttendance(null)}>
                  Close
                </Button>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Record
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Attendance Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student">Student</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stu001">Emma Johnson (STU001)</SelectItem>
                    <SelectItem value="stu002">Michael Chen (STU002)</SelectItem>
                    <SelectItem value="stu003">Sarah Williams (STU003)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="period">Period</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="period-1">Period 1</SelectItem>
                    <SelectItem value="period-2">Period 2</SelectItem>
                    <SelectItem value="period-3">Period 3</SelectItem>
                    <SelectItem value="period-4">Period 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeIn">Time In</Label>
                <Input id="timeIn" type="time" />
              </div>
            </div>
            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" placeholder="Any additional notes..." />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddDialog(false)}>
                Mark Attendance
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
