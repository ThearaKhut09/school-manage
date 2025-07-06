'use client'

import { useState, useEffect } from 'react'
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
import { DatePicker } from '@/components/ui/date-picker'
import {
  FileText,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  PieChart,
} from 'lucide-react'

// Mock data for assignments
const mockAssignments = [
  {
    id: '1',
    title: 'Algebra Problem Set #3',
    description: 'Complete problems 1-25 from Chapter 5: Quadratic Equations',
    subject: 'Mathematics',
    class: 'Grade 10-A',
    teacher: 'Dr. Emily Johnson',
    assignedDate: '2024-01-15',
    dueDate: '2024-01-22',
    status: 'Active',
    totalStudents: 30,
    submitted: 18,
    graded: 12,
    avgScore: 85,
    maxMarks: 100,
    type: 'Homework',
    priority: 'Medium',
    instructions: 'Show all work and explain your reasoning for each problem.',
    attachments: ['algebra_problems.pdf', 'formula_sheet.pdf'],
  },
  {
    id: '2',
    title: 'Romeo and Juliet Essay',
    description: 'Write a 500-word essay analyzing the themes of love and fate in Romeo and Juliet',
    subject: 'English',
    class: 'Grade 11-A',
    teacher: 'Ms. Sarah Williams',
    assignedDate: '2024-01-10',
    dueDate: '2024-01-25',
    status: 'Active',
    totalStudents: 28,
    submitted: 25,
    graded: 20,
    avgScore: 78,
    maxMarks: 100,
    type: 'Essay',
    priority: 'High',
    instructions: 'Use at least 3 quotes from the text to support your arguments.',
    attachments: ['essay_rubric.pdf', 'citation_guide.pdf'],
  },
  {
    id: '3',
    title: 'Cell Structure Lab Report',
    description: 'Complete lab report on microscopic observation of plant and animal cells',
    subject: 'Biology',
    class: 'Grade 9-A',
    teacher: 'Dr. Michael Chen',
    assignedDate: '2024-01-08',
    dueDate: '2024-01-18',
    status: 'Completed',
    totalStudents: 25,
    submitted: 25,
    graded: 25,
    avgScore: 92,
    maxMarks: 100,
    type: 'Lab Report',
    priority: 'High',
    instructions: 'Include labeled diagrams and detailed observations.',
    attachments: ['lab_template.docx', 'observation_sheet.pdf'],
  },
  {
    id: '4',
    title: 'World War II Timeline',
    description: 'Create a comprehensive timeline of major events in World War II',
    subject: 'History',
    class: 'Grade 12-B',
    teacher: 'Mr. James Rodriguez',
    assignedDate: '2024-01-20',
    dueDate: '2024-02-05',
    status: 'Draft',
    totalStudents: 32,
    submitted: 0,
    graded: 0,
    avgScore: 0,
    maxMarks: 100,
    type: 'Project',
    priority: 'Medium',
    instructions: 'Include at least 20 major events with dates and brief descriptions.',
    attachments: ['timeline_template.pptx', 'reference_sources.pdf'],
  },
]

export default function AssignmentsPage() {
  const [assignments] = useState(mockAssignments)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedAssignment, setSelectedAssignment] = useState<typeof mockAssignments[0] | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSubject = selectedSubject === 'all' || assignment.subject === selectedSubject
    const matchesClass = selectedClass === 'all' || assignment.class === selectedClass
    const matchesStatus = selectedStatus === 'all' || assignment.status.toLowerCase() === selectedStatus.toLowerCase()
    
    return matchesSearch && matchesSubject && matchesClass && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Clock className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'draft':
        return <AlertCircle className="w-4 h-4" />
      case 'overdue':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'homework':
        return 'bg-blue-100 text-blue-800'
      case 'project':
        return 'bg-purple-100 text-purple-800'
      case 'essay':
        return 'bg-orange-100 text-orange-800'
      case 'lab report':
        return 'bg-teal-100 text-teal-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSubmissionProgress = (submitted: number, total: number) => {
    return Math.round((submitted / total) * 100)
  }

  const getGradingProgress = (graded: number, total: number) => {
    return Math.round((graded / total) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignment Management</h1>
          <p className="text-gray-600">Create, manage, and track student assignments</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.filter(a => a.status === 'Active').length}
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
                <p className="text-sm font-medium text-gray-600">Pending Grading</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.reduce((acc, a) => acc + (a.submitted - a.graded), 0)}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <PieChart className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(assignments.reduce((acc, a) => acc + a.avgScore, 0) / assignments.length)}%
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search assignments..."
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
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="Grade 9-A">Grade 9-A</SelectItem>
                <SelectItem value="Grade 10-A">Grade 10-A</SelectItem>
                <SelectItem value="Grade 11-A">Grade 11-A</SelectItem>
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Assignments ({filteredAssignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAssignments.map(assignment => (
              <div key={assignment.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                      <Badge className={getStatusColor(assignment.status)}>
                        {getStatusIcon(assignment.status)}
                        <span className="ml-1">{assignment.status}</span>
                      </Badge>
                      <Badge className={getPriorityColor(assignment.priority)}>
                        {assignment.priority}
                      </Badge>
                      <Badge className={getTypeColor(assignment.type)}>
                        {assignment.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {assignment.subject}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {assignment.class}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due: {assignment.dueDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">Submissions</div>
                      <div className="text-sm text-gray-600">
                        {assignment.submitted}/{assignment.totalStudents}
                        <span className="ml-1">({getSubmissionProgress(assignment.submitted, assignment.totalStudents)}%)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Graded</div>
                      <div className="text-sm text-gray-600">
                        {assignment.graded}/{assignment.totalStudents}
                        <span className="ml-1">({getGradingProgress(assignment.graded, assignment.totalStudents)}%)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Avg. Score</div>
                      <div className="text-sm text-gray-600">
                        {assignment.avgScore}%
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
                        <DropdownMenuItem onClick={() => setSelectedAssignment(assignment)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Assignment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          View Submissions
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <PieChart className="mr-2 h-4 w-4" />
                          Grade Submissions
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Assignment
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

      {/* Assignment Details Dialog */}
      <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assignment Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedAssignment?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedAssignment.title}</h3>
                  <p className="text-gray-600">{selectedAssignment.subject} • {selectedAssignment.class}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(selectedAssignment.status)}>
                    {getStatusIcon(selectedAssignment.status)}
                    <span className="ml-1">{selectedAssignment.status}</span>
                  </Badge>
                  <Badge className={getPriorityColor(selectedAssignment.priority)}>
                    {selectedAssignment.priority}
                  </Badge>
                  <Badge className={getTypeColor(selectedAssignment.type)}>
                    {selectedAssignment.type}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Assignment Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Description:</strong> {selectedAssignment.description}</p>
                    <p><strong>Teacher:</strong> {selectedAssignment.teacher}</p>
                    <p><strong>Assigned Date:</strong> {selectedAssignment.assignedDate}</p>
                    <p><strong>Due Date:</strong> {selectedAssignment.dueDate}</p>
                    <p><strong>Max Marks:</strong> {selectedAssignment.maxMarks}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Instructions</h4>
                  <p className="text-sm text-gray-600">{selectedAssignment.instructions}</p>
                  
                  <h4 className="font-semibold mb-3 mt-4">Attachments</h4>
                  <div className="space-y-1">
                    {selectedAssignment.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center text-sm text-blue-600">
                        <FileText className="w-4 h-4 mr-2" />
                        {attachment}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedAssignment.totalStudents}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedAssignment.submitted}</div>
                  <div className="text-sm text-gray-600">Submitted</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedAssignment.graded}</div>
                  <div className="text-sm text-gray-600">Graded</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{selectedAssignment.avgScore}%</div>
                  <div className="text-sm text-gray-600">Avg. Score</div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
                  Close
                </Button>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Assignment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Assignment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Assignment Title</Label>
                <Input id="title" placeholder="Enter assignment title" />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homework">Homework</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="essay">Essay</SelectItem>
                    <SelectItem value="lab-report">Lab Report</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter assignment description" />
            </div>
            <div className="grid grid-cols-3 gap-4">
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
                    <SelectItem value="biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="class">Class</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grade-9-a">Grade 9-A</SelectItem>
                    <SelectItem value="grade-10-a">Grade 10-A</SelectItem>
                    <SelectItem value="grade-11-a">Grade 11-A</SelectItem>
                    <SelectItem value="grade-12-b">Grade 12-B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" />
              </div>
              <div>
                <Label htmlFor="maxMarks">Maximum Marks</Label>
                <Input id="maxMarks" type="number" placeholder="Enter max marks" />
              </div>
            </div>
            <div>
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea id="instructions" placeholder="Enter detailed instructions for students" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddDialog(false)}>
                Create Assignment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
