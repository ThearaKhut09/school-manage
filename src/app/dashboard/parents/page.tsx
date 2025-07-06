'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  Bell,
  CreditCard,
  BookOpen,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Star,
  Heart,
  UserPlus,
} from 'lucide-react'

interface Parent {
  id: string
  userId: string
  fatherName: string | null
  motherName: string | null
  occupation: string | null
  phone: string
  address: string
  relationship: string
  isActive: boolean
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
  }
  students: {
    student: {
      id: string
      user: {
        id: string
        name: string
        email: string
      }
      class: {
        id: string
        name: string
        section: string
      }
    }
  }[]
  createdAt: string
  updatedAt: string
}

// Mock data
const mockParents: Parent[] = [
  {
    id: '1',
    userId: 'user1',
    fatherName: 'John Smith',
    motherName: 'Jane Smith',
    occupation: 'Engineer',
    phone: '+1234567890',
    address: '123 Main St, City, State 12345',
    relationship: 'Father',
    isActive: true,
    user: {
      id: 'user1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      avatar: null,
    },
    students: [
      {
        student: {
          id: 'student1',
          user: {
            id: 'user_student1',
            name: 'Alex Smith',
            email: 'alex.smith@school.com',
          },
          class: {
            id: 'class1',
            name: 'Grade 10',
            section: 'A',
          },
        },
      },
    ],
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    userId: 'user2',
    fatherName: 'Michael Johnson',
    motherName: 'Sarah Johnson',
    occupation: 'Doctor',
    phone: '+1234567891',
    address: '456 Oak Ave, City, State 12345',
    relationship: 'Mother',
    isActive: true,
    user: {
      id: 'user2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      avatar: null,
    },
    students: [
      {
        student: {
          id: 'student2',
          user: {
            id: 'user_student2',
            name: 'Emma Johnson',
            email: 'emma.johnson@school.com',
          },
          class: {
            id: 'class2',
            name: 'Grade 9',
            section: 'B',
          },
        },
      },
    ],
    createdAt: '2023-02-20T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
]

// Mock student portal data
const mockStudentPortalData = {
  student: {
    id: 'student1',
    name: 'Alex Smith',
    class: 'Grade 10-A',
    rollNumber: 'STU001',
    avatar: null,
  },
  attendance: {
    present: 85,
    absent: 5,
    late: 3,
    percentage: 91.3,
  },
  assignments: [
    {
      id: '1',
      title: 'Math Assignment 1',
      subject: 'Mathematics',
      dueDate: '2024-01-20',
      status: 'submitted',
      grade: 'A',
    },
    {
      id: '2',
      title: 'Science Project',
      subject: 'Science',
      dueDate: '2024-01-25',
      status: 'pending',
      grade: null,
    },
  ],
  grades: [
    {
      id: '1',
      subject: 'Mathematics',
      grade: 'A',
      percentage: 92,
      remarks: 'Excellent work',
    },
    {
      id: '2',
      subject: 'Science',
      grade: 'B+',
      percentage: 87,
      remarks: 'Good performance',
    },
  ],
  fees: {
    totalAmount: 5000,
    paidAmount: 3000,
    dueAmount: 2000,
    dueDate: '2024-02-15',
    status: 'partial',
  },
  announcements: [
    {
      id: '1',
      title: 'School Sports Day',
      message: 'Annual sports day scheduled for February 15th',
      date: '2024-01-15',
      type: 'event',
    },
    {
      id: '2',
      title: 'Parent-Teacher Meeting',
      message: 'PTM scheduled for January 30th',
      date: '2024-01-12',
      type: 'meeting',
    },
  ],
}

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>(mockParents)
  const [filteredParents, setFilteredParents] = useState<Parent[]>(mockParents)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('parents')

  // Filter parents based on search and filters
  useEffect(() => {
    let filtered = parents

    if (searchTerm) {
      filtered = filtered.filter(parent =>
        parent.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.phone.includes(searchTerm) ||
        parent.students.some(s => s.student.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedStatus) {
      filtered = filtered.filter(parent => 
        selectedStatus === 'active' ? parent.isActive : !parent.isActive
      )
    }

    setFilteredParents(filtered)
  }, [searchTerm, selectedStatus, parents])

  const handleViewDetails = (parent: Parent) => {
    setSelectedParent(parent)
    setShowDetailsDialog(true)
  }

  const handleDeleteParent = (parentId: string) => {
    if (confirm('Are you sure you want to remove this parent?')) {
      setParents(prev => prev.filter(p => p.id !== parentId))
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600'
    if (grade.startsWith('B')) return 'text-blue-600'
    if (grade.startsWith('C')) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getFeesStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'partial': return 'bg-yellow-100 text-yellow-800'
      case 'due': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parent & Student Portal</h1>
          <p className="text-gray-600">Manage parent accounts and student portal access</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Parents
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Parent
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="parents">Parent Management</TabsTrigger>
          <TabsTrigger value="student-portal">Student Portal</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        {/* Parent Management Tab */}
        <TabsContent value="parents" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Parents</p>
                    <p className="text-2xl font-bold text-gray-900">{parents.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <UserPlus className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Parents</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {parents.filter(p => p.isActive).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <GraduationCap className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Students</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {parents.reduce((sum, p) => sum + p.students.length, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Messages</p>
                    <p className="text-2xl font-bold text-gray-900">42</p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search parents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Parent Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parent</TableHead>
                    <TableHead>Children</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParents.map((parent) => (
                    <TableRow key={parent.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={parent.user.avatar || ''} />
                            <AvatarFallback>
                              {parent.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{parent.user.name}</div>
                            <div className="text-sm text-gray-500">{parent.user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {parent.students.map((s, index) => (
                            <div key={s.student.id} className="text-sm">
                              {s.student.user.name} ({s.student.class.name}-{s.student.class.section})
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {parent.phone}
                          </div>
                          <div className="flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {parent.address.split(',')[0]}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{parent.relationship}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(parent.isActive)}>
                          {parent.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(parent)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteParent(parent.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Portal Tab */}
        <TabsContent value="student-portal" className="space-y-6">
          {/* Student Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Student Dashboard - {mockStudentPortalData.student.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Attendance */}
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {mockStudentPortalData.attendance.percentage}%
                      </div>
                      <div className="text-sm text-gray-600">Attendance</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {mockStudentPortalData.attendance.present} Present, {mockStudentPortalData.attendance.absent} Absent
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Assignments */}
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {mockStudentPortalData.assignments.filter(a => a.status === 'submitted').length}
                      </div>
                      <div className="text-sm text-gray-600">Assignments</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {mockStudentPortalData.assignments.filter(a => a.status === 'pending').length} Pending
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Grades */}
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {(mockStudentPortalData.grades.reduce((sum, g) => sum + g.percentage, 0) / mockStudentPortalData.grades.length).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Avg Grade</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {mockStudentPortalData.grades.length} Subjects
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Fees */}
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        ${mockStudentPortalData.fees.dueAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Due Amount</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Due: {new Date(mockStudentPortalData.fees.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Recent Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockStudentPortalData.assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{assignment.title}</div>
                        <div className="text-sm text-gray-500">
                          {assignment.subject} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getAssignmentStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                        {assignment.grade && (
                          <Badge variant="outline">
                            {assignment.grade}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Grades */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Recent Grades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockStudentPortalData.grades.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{grade.subject}</div>
                        <div className="text-sm text-gray-500">{grade.remarks}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${getGradeColor(grade.grade)}`}>
                          {grade.grade}
                        </div>
                        <div className="text-sm text-gray-500">
                          {grade.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="space-y-6">
          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Recent Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStudentPortalData.announcements.map((announcement) => (
                  <div key={announcement.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{announcement.title}</h3>
                      <Badge variant="outline">{announcement.type}</Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{announcement.message}</p>
                    <div className="text-sm text-gray-500">
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Message Center */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Message Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No messages yet. Communication features will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Parent Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Parent Details</DialogTitle>
          </DialogHeader>
          {selectedParent && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Parent Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Name:</span>
                      <span className="ml-2">{selectedParent.user.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{selectedParent.user.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{selectedParent.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Relationship:</span>
                      <span className="ml-2">{selectedParent.relationship}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Address:</span>
                      <span className="ml-2">{selectedParent.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Children</h3>
                  <div className="space-y-2">
                    {selectedParent.students.map((s) => (
                      <div key={s.student.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium">{s.student.user.name}</div>
                        <div className="text-sm text-gray-500">
                          {s.student.class.name}-{s.student.class.section}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
                <Button>
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
