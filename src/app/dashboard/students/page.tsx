'use client'

import { useState } from 'react'
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
import {
  Users,
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
  GraduationCap,
} from 'lucide-react'

// Mock data for students
const mockStudents = [
  {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma.johnson@email.com',
    phone: '+1 (555) 123-4567',
    class: 'Grade 10-A',
    rollNumber: '2024001',
    admissionDate: '2024-08-15',
    status: 'Active',
    avatar: '/avatars/emma.jpg',
    address: '123 Main St, Springfield',
    dateOfBirth: '2008-03-15',
    gender: 'Female',
    bloodGroup: 'A+',
    parentName: 'Robert Johnson',
    parentPhone: '+1 (555) 123-4568',
    fees: 'Paid',
    attendance: 95,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    class: 'Grade 10-B',
    rollNumber: '2024002',
    admissionDate: '2024-08-16',
    status: 'Active',
    avatar: '/avatars/michael.jpg',
    address: '456 Oak Ave, Springfield',
    dateOfBirth: '2008-07-22',
    gender: 'Male',
    bloodGroup: 'B+',
    parentName: 'Linda Chen',
    parentPhone: '+1 (555) 234-5679',
    fees: 'Pending',
    attendance: 88,
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah.williams@email.com',
    phone: '+1 (555) 345-6789',
    class: 'Grade 9-A',
    rollNumber: '2024003',
    admissionDate: '2024-08-17',
    status: 'Active',
    avatar: '/avatars/sarah.jpg',
    address: '789 Pine Rd, Springfield',
    dateOfBirth: '2009-01-10',
    gender: 'Female',
    bloodGroup: 'O+',
    parentName: 'David Williams',
    parentPhone: '+1 (555) 345-6790',
    fees: 'Paid',
    attendance: 92,
  },
  {
    id: '4',
    name: 'James Rodriguez',
    email: 'james.rodriguez@email.com',
    phone: '+1 (555) 456-7890',
    class: 'Grade 11-A',
    rollNumber: '2024004',
    admissionDate: '2024-08-18',
    status: 'Active',
    avatar: '/avatars/james.jpg',
    address: '321 Elm St, Springfield',
    dateOfBirth: '2007-11-05',
    gender: 'Male',
    bloodGroup: 'AB+',
    parentName: 'Maria Rodriguez',
    parentPhone: '+1 (555) 456-7891',
    fees: 'Overdue',
    attendance: 78,
  },
]

export default function StudentsPage() {
  const [students] = useState(mockStudents)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesClass = selectedClass === 'all' || student.class === selectedClass
    const matchesStatus = selectedStatus === 'all' || student.status.toLowerCase() === selectedStatus.toLowerCase()
    
    return matchesSearch && matchesClass && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'suspended': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFeesColor = (fees: string) => {
    switch (fees.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600'
    if (attendance >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Manage student records, admissions, and profiles</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Students
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
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
                <SelectItem value="Grade 9-B">Grade 9-B</SelectItem>
                <SelectItem value="Grade 10-A">Grade 10-A</SelectItem>
                <SelectItem value="Grade 10-B">Grade 10-B</SelectItem>
                <SelectItem value="Grade 11-A">Grade 11-A</SelectItem>
                <SelectItem value="Grade 11-B">Grade 11-B</SelectItem>
                <SelectItem value="Grade 12-A">Grade 12-A</SelectItem>
                <SelectItem value="Grade 12-B">Grade 12-B</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Showing {filteredStudents.length} of {students.length} students
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Students ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">
                      Roll: {student.rollNumber} • Class: {student.class}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {student.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {student.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm">
                      <Badge className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </div>
                    <div className="text-sm mt-1">
                      <Badge className={getFeesColor(student.fees)}>
                        Fees: {student.fees}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Attendance</div>
                    <div className={`text-sm ${getAttendanceColor(student.attendance)}`}>
                      {student.attendance}%
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
                      <DropdownMenuItem onClick={() => setSelectedStudent(student)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Student
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedStudent.avatar} alt={selectedStudent.name} />
                  <AvatarFallback>
                    {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-gray-600">Roll Number: {selectedStudent.rollNumber}</p>
                  <p className="text-gray-600">Class: {selectedStudent.class}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>DOB: {selectedStudent.dateOfBirth}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Gender: {selectedStudent.gender}</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Blood Group: {selectedStudent.bloodGroup}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Address: {selectedStudent.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{selectedStudent.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{selectedStudent.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Parent: {selectedStudent.parentName}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Parent: {selectedStudent.parentPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedStudent.attendance}%</div>
                  <div className="text-sm text-gray-600">Attendance</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedStudent.fees}</div>
                  <div className="text-sm text-gray-600">Fee Status</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedStudent.status}</div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                  Close
                </Button>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Student
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input placeholder="Enter first name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input placeholder="Enter last name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" placeholder="student@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Class</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grade-10-a">Grade 10-A</SelectItem>
                    <SelectItem value="grade-10-b">Grade 10-B</SelectItem>
                    <SelectItem value="grade-9-a">Grade 9-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddDialog(false)}>
                Add Student
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
