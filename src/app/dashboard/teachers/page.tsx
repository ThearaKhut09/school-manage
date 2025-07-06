'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  GraduationCap,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  Users,
  Award,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

// Mock data for teachers
const mockTeachers = [
  {
    id: '1',
    name: 'Dr. Emily Johnson',
    email: 'emily.johnson@school.com',
    phone: '+1 (555) 123-4567',
    subject: 'Mathematics',
    experience: '8 years',
    qualification: 'Ph.D. in Mathematics',
    employeeId: 'EMP001',
    joinDate: '2020-01-15',
    status: 'Active',
    avatar: '/avatars/emily.jpg',
    address: '123 Academic St, Springfield',
    dateOfBirth: '1985-05-20',
    gender: 'Female',
    emergencyContact: '+1 (555) 123-4568',
    salary: '$65,000',
    performance: 'Excellent',
    classes: ['Grade 10-A', 'Grade 11-B'],
    subjects: ['Mathematics', 'Statistics'],
    attendance: 96,
    leaveBalance: 12,
    totalStudents: 85,
  },
  {
    id: '2',
    name: 'Mr. David Chen',
    email: 'david.chen@school.com',
    phone: '+1 (555) 234-5678',
    subject: 'Science',
    experience: '6 years',
    qualification: 'M.Sc. in Physics',
    employeeId: 'EMP002',
    joinDate: '2021-08-01',
    status: 'Active',
    avatar: '/avatars/david.jpg',
    address: '456 Research Ave, Springfield',
    dateOfBirth: '1988-11-12',
    gender: 'Male',
    emergencyContact: '+1 (555) 234-5679',
    salary: '$58,000',
    performance: 'Good',
    classes: ['Grade 9-A', 'Grade 10-B'],
    subjects: ['Physics', 'Chemistry'],
    attendance: 94,
    leaveBalance: 8,
    totalStudents: 72,
  },
  {
    id: '3',
    name: 'Ms. Sarah Williams',
    email: 'sarah.williams@school.com',
    phone: '+1 (555) 345-6789',
    subject: 'English',
    experience: '10 years',
    qualification: 'M.A. in English Literature',
    employeeId: 'EMP003',
    joinDate: '2019-03-10',
    status: 'Active',
    avatar: '/avatars/sarah.jpg',
    address: '789 Literature Ln, Springfield',
    dateOfBirth: '1983-07-08',
    gender: 'Female',
    emergencyContact: '+1 (555) 345-6790',
    salary: '$62,000',
    performance: 'Excellent',
    classes: ['Grade 11-A', 'Grade 12-A'],
    subjects: ['English', 'Literature'],
    attendance: 98,
    leaveBalance: 15,
    totalStudents: 95,
  },
  {
    id: '4',
    name: 'Mr. James Rodriguez',
    email: 'james.rodriguez@school.com',
    phone: '+1 (555) 456-7890',
    subject: 'History',
    experience: '4 years',
    qualification: 'M.A. in History',
    employeeId: 'EMP004',
    joinDate: '2022-09-05',
    status: 'On Leave',
    avatar: '/avatars/james.jpg',
    address: '321 Historical Blvd, Springfield',
    dateOfBirth: '1990-02-14',
    gender: 'Male',
    emergencyContact: '+1 (555) 456-7891',
    salary: '$54,000',
    performance: 'Good',
    classes: ['Grade 9-B', 'Grade 10-A'],
    subjects: ['History', 'Geography'],
    attendance: 88,
    leaveBalance: 5,
    totalStudents: 68,
  },
]

export default function TeachersPage() {
  const [teachers] = useState(mockTeachers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedTeacher, setSelectedTeacher] = useState<typeof mockTeachers[0] | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSubject = selectedSubject === 'all' || teacher.subject === selectedSubject
    const matchesStatus = selectedStatus === 'all' || teacher.status.toLowerCase() === selectedStatus.toLowerCase()
    
    return matchesSearch && matchesSubject && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'on leave':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance.toLowerCase()) {
      case 'excellent':
        return 'text-green-600'
      case 'good':
        return 'text-blue-600'
      case 'needs improvement':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return 'text-green-600'
    if (attendance >= 90) return 'text-blue-600'
    if (attendance >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers Management</h1>
          <p className="text-gray-600">Manage teaching staff, profiles, and performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Teachers
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Teachers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teachers.filter(t => t.status === 'Active').length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Avg. Experience</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(teachers.reduce((acc, t) => acc + parseInt(t.experience), 0) / teachers.length)} years
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Attendance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(teachers.reduce((acc, t) => acc + t.attendance, 0) / teachers.length)}%
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on leave">On Leave</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teachers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Teachers ({filteredTeachers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTeachers.map(teacher => (
              <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={teacher.avatar} alt={teacher.name} />
                    <AvatarFallback>
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                      <Badge className={getStatusColor(teacher.status)}>
                        {teacher.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{teacher.employeeId}</span>
                      <span>•</span>
                      <span>{teacher.subject}</span>
                      <span>•</span>
                      <span>{teacher.experience} experience</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm mt-1">
                      <Badge variant="outline">
                        {teacher.classes.length} Classes
                      </Badge>
                      <Badge variant="outline">
                        {teacher.totalStudents} Students
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">Performance</div>
                    <div className={`text-sm ${getPerformanceColor(teacher.performance)}`}>
                      {teacher.performance}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Attendance</div>
                    <div className={`text-sm ${getAttendanceColor(teacher.attendance)}`}>
                      {teacher.attendance}%
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSelectedTeacher(teacher)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Teacher
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Clock className="mr-2 h-4 w-4" />
                        View Schedule
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Payroll Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Teacher
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Teacher Details Dialog */}
      <Dialog open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Teacher Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedTeacher?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedTeacher && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedTeacher.avatar} alt={selectedTeacher.name} />
                  <AvatarFallback>
                    {selectedTeacher.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">{selectedTeacher.name}</h3>
                  <p className="text-gray-600">Employee ID: {selectedTeacher.employeeId}</p>
                  <p className="text-gray-600">Subject: {selectedTeacher.subject}</p>
                  <Badge className={getStatusColor(selectedTeacher.status)}>
                    {selectedTeacher.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>DOB: {selectedTeacher.dateOfBirth}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Gender: {selectedTeacher.gender}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Address: {selectedTeacher.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Emergency: {selectedTeacher.emergencyContact}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Professional Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Qualification: {selectedTeacher.qualification}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Experience: {selectedTeacher.experience}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Join Date: {selectedTeacher.joinDate}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Salary: {selectedTeacher.salary}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedTeacher.attendance}%</div>
                  <div className="text-sm text-gray-600">Attendance</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedTeacher.performance}</div>
                  <div className="text-sm text-gray-600">Performance</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedTeacher.totalStudents}</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{selectedTeacher.leaveBalance}</div>
                  <div className="text-sm text-gray-600">Leave Days</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Teaching Assignment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Classes</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTeacher.classes.map(cls => (
                        <Badge key={cls} variant="outline">{cls}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Subjects</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTeacher.subjects.map(subject => (
                        <Badge key={subject} variant="outline">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setSelectedTeacher(null)}>
                  Close
                </Button>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Teacher
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Teacher Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter first name" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter last name" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="teacher@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" placeholder="Enter employee ID" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject">Primary Subject</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="qualification">Qualification</Label>
                <Input id="qualification" placeholder="Enter qualification" />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Enter address" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddDialog(false)}>
                Add Teacher
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
