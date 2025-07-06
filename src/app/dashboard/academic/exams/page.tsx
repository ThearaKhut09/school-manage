'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  BookOpen,
  GraduationCap,
  Trophy,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  ClipboardCheck,
  Calculator,
  PieChart,
  Activity,
  Star,
  Target,
  Award,
} from 'lucide-react'

interface Exam {
  id: string
  subjectId: string
  title: string
  description: string | null
  examDate: string
  startTime: string
  endTime: string
  maxMarks: number
  passingMarks: number
  examType: 'UNIT_TEST' | 'MIDTERM' | 'FINAL' | 'ASSIGNMENT' | 'PROJECT'
  isActive: boolean
  subject: {
    id: string
    name: string
    code: string
    school: {
      id: string
      name: string
    }
  }
  results: ExamResult[]
  createdAt: string
  updatedAt: string
}

interface ExamResult {
  id: string
  examId: string
  studentId: string
  marksObtained: number
  grade: string | null
  remarks: string | null
  isAbsent: boolean
  student: {
    id: string
    user: {
      id: string
      name: string
    }
    class: {
      id: string
      name: string
      section: string
    }
  }
  createdAt: string
  updatedAt: string
}

// Mock data
const mockExams: Exam[] = [
  {
    id: '1',
    subjectId: 'subject1',
    title: 'Mathematics Midterm Examination',
    description: 'Comprehensive midterm exam covering algebra and geometry',
    examDate: '2024-02-15T00:00:00.000Z',
    startTime: '09:00',
    endTime: '12:00',
    maxMarks: 100,
    passingMarks: 40,
    examType: 'MIDTERM',
    isActive: true,
    subject: {
      id: 'subject1',
      name: 'Mathematics',
      code: 'MATH10',
      school: {
        id: 'school1',
        name: 'Springfield High School'
      }
    },
    results: [
      {
        id: '1',
        examId: '1',
        studentId: 'student1',
        marksObtained: 85,
        grade: 'A',
        remarks: 'Excellent performance',
        isAbsent: false,
        student: {
          id: 'student1',
          user: {
            id: 'user1',
            name: 'Alex Smith'
          },
          class: {
            id: 'class1',
            name: 'Grade 10',
            section: 'A'
          }
        },
        createdAt: '2024-02-15T00:00:00.000Z',
        updatedAt: '2024-02-15T00:00:00.000Z'
      },
      {
        id: '2',
        examId: '1',
        studentId: 'student2',
        marksObtained: 72,
        grade: 'B',
        remarks: 'Good performance',
        isAbsent: false,
        student: {
          id: 'student2',
          user: {
            id: 'user2',
            name: 'Emma Johnson'
          },
          class: {
            id: 'class1',
            name: 'Grade 10',
            section: 'A'
          }
        },
        createdAt: '2024-02-15T00:00:00.000Z',
        updatedAt: '2024-02-15T00:00:00.000Z'
      }
    ],
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: '2',
    subjectId: 'subject2',
    title: 'Science Unit Test 1',
    description: 'Unit test covering physics and chemistry basics',
    examDate: '2024-01-25T00:00:00.000Z',
    startTime: '10:00',
    endTime: '11:30',
    maxMarks: 50,
    passingMarks: 20,
    examType: 'UNIT_TEST',
    isActive: true,
    subject: {
      id: 'subject2',
      name: 'Science',
      code: 'SCI10',
      school: {
        id: 'school1',
        name: 'Springfield High School'
      }
    },
    results: [],
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z'
  }
]

const examTypes = [
  { value: 'UNIT_TEST', label: 'Unit Test', color: 'bg-blue-100 text-blue-800' },
  { value: 'MIDTERM', label: 'Midterm', color: 'bg-purple-100 text-purple-800' },
  { value: 'FINAL', label: 'Final Exam', color: 'bg-red-100 text-red-800' },
  { value: 'ASSIGNMENT', label: 'Assignment', color: 'bg-green-100 text-green-800' },
  { value: 'PROJECT', label: 'Project', color: 'bg-yellow-100 text-yellow-800' },
]

const subjects = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
]

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>(mockExams)
  const [filteredExams, setFilteredExams] = useState<Exam[]>(mockExams)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [selectedExamType, setSelectedExamType] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [showAddExamDialog, setShowAddExamDialog] = useState(false)
  const [showExamDetailsDialog, setShowExamDetailsDialog] = useState(false)
  const [showResultsDialog, setShowResultsDialog] = useState(false)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [activeTab, setActiveTab] = useState('exams')

  // Filter exams
  useEffect(() => {
    let filtered = exams

    if (searchTerm) {
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exam.description && exam.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedSubject) {
      filtered = filtered.filter(exam => exam.subject.name === selectedSubject)
    }

    if (selectedExamType) {
      filtered = filtered.filter(exam => exam.examType === selectedExamType)
    }

    if (selectedStatus) {
      const now = new Date()
      filtered = filtered.filter(exam => {
        const examDate = new Date(exam.examDate)
        if (selectedStatus === 'upcoming') return examDate > now
        if (selectedStatus === 'completed') return examDate <= now
        if (selectedStatus === 'active') return exam.isActive
        if (selectedStatus === 'inactive') return !exam.isActive
        return true
      })
    }

    setFilteredExams(filtered)
  }, [searchTerm, selectedSubject, selectedExamType, selectedStatus, exams])

  const handleAddExam = () => {
    setSelectedExam(null)
    setShowAddExamDialog(true)
  }

  const handleEditExam = (exam: Exam) => {
    setSelectedExam(exam)
    setShowAddExamDialog(true)
  }

  const handleViewExamDetails = (exam: Exam) => {
    setSelectedExam(exam)
    setShowExamDetailsDialog(true)
  }

  const handleViewResults = (exam: Exam) => {
    setSelectedExam(exam)
    setShowResultsDialog(true)
  }

  const handleDeleteExam = (examId: string) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      setExams(prev => prev.filter(exam => exam.id !== examId))
    }
  }

  const getExamTypeInfo = (examType: string) => {
    return examTypes.find(type => type.value === examType) || examTypes[0]
  }

  const getGradeColor = (grade: string | null) => {
    if (!grade) return 'text-gray-500'
    if (grade.startsWith('A')) return 'text-green-600'
    if (grade.startsWith('B')) return 'text-blue-600'
    if (grade.startsWith('C')) return 'text-yellow-600'
    if (grade.startsWith('D')) return 'text-orange-600'
    return 'text-red-600'
  }

  const calculatePassPercentage = (exam: Exam) => {
    if (exam.results.length === 0) return 0
    const passedStudents = exam.results.filter(result => 
      !result.isAbsent && result.marksObtained >= exam.passingMarks
    ).length
    return (passedStudents / exam.results.length) * 100
  }

  const calculateAverageMarks = (exam: Exam) => {
    if (exam.results.length === 0) return 0
    const presentResults = exam.results.filter(result => !result.isAbsent)
    if (presentResults.length === 0) return 0
    const totalMarks = presentResults.reduce((sum, result) => sum + result.marksObtained, 0)
    return totalMarks / presentResults.length
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  const isExamUpcoming = (examDate: string) => {
    return new Date(examDate) > new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600">Manage exams, schedules, and results</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Results
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Exam Schedule
          </Button>
          <Button size="sm" onClick={handleAddExam}>
            <Plus className="w-4 h-4 mr-2" />
            Add Exam
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ClipboardCheck className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.filter(exam => isExamUpcoming(exam.examDate)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.filter(exam => !isExamUpcoming(exam.examDate)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Results</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.reduce((sum, exam) => sum + exam.results.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="exams">Exam Management</TabsTrigger>
          <TabsTrigger value="results">Results & Grades</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Exams Tab */}
        <TabsContent value="exams" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Exam Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search exams..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="All subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All subjects</SelectItem>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="examType">Exam Type</Label>
                  <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      {examTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
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

          {/* Exams Table */}
          <Card>
            <CardHeader>
              <CardTitle>Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExams.map((exam) => {
                    const typeInfo = getExamTypeInfo(exam.examType)
                    return (
                      <TableRow key={exam.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{exam.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {exam.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{exam.subject.name}</div>
                            <div className="text-sm text-gray-500">{exam.subject.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{formatDate(exam.examDate)}</div>
                            <div className="text-gray-500">
                              {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Max: {exam.maxMarks}</div>
                            <div className="text-gray-500">Pass: {exam.passingMarks}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{exam.results.length} submissions</div>
                            {exam.results.length > 0 && (
                              <div className="text-gray-500">
                                Avg: {calculateAverageMarks(exam).toFixed(1)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <Badge className={exam.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {exam.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline">
                              {isExamUpcoming(exam.examDate) ? 'Upcoming' : 'Completed'}
                            </Badge>
                          </div>
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
                              <DropdownMenuItem onClick={() => handleViewExamDetails(exam)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditExam(exam)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewResults(exam)}>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View Results
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calculator className="mr-2 h-4 w-4" />
                                Enter Results
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteExam(exam.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Exam Results Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exams.filter(exam => exam.results.length > 0).map((exam) => (
                  <div key={exam.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{exam.title}</h3>
                        <p className="text-sm text-gray-500">{exam.subject.name} • {formatDate(exam.examDate)}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {calculateAverageMarks(exam).toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">Avg Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {calculatePassPercentage(exam).toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500">Pass Rate</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleViewResults(exam)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-medium">{exam.results.length}</div>
                        <div className="text-gray-600">Total Students</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-medium">
                          {exam.results.filter(r => !r.isAbsent && r.marksObtained >= exam.passingMarks).length}
                        </div>
                        <div className="text-gray-600">Passed</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="font-medium">
                          {exam.results.filter(r => !r.isAbsent && r.marksObtained < exam.passingMarks).length}
                        </div>
                        <div className="text-gray-600">Failed</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">
                          {exam.results.filter(r => r.isAbsent).length}
                        </div>
                        <div className="text-gray-600">Absent</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Performance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8 text-gray-500">
                  <PieChart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Performance analytics chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Score Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Score trend analysis will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Subject-wise Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Subject performance comparison will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Exam Dialog */}
      <Dialog open={showAddExamDialog} onOpenChange={setShowAddExamDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedExam ? 'Edit Exam' : 'Add New Exam'}
            </DialogTitle>
            <DialogDescription>
              {selectedExam ? 'Update the exam details.' : 'Create a new exam for your school.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="examTitle">Exam Title</Label>
              <Input 
                id="examTitle" 
                placeholder="Mathematics Midterm Examination"
                defaultValue={selectedExam?.title}
              />
            </div>
            <div>
              <Label htmlFor="examDescription">Description</Label>
              <Textarea 
                id="examDescription" 
                placeholder="Exam description..."
                defaultValue={selectedExam?.description || ''}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select defaultValue={selectedExam?.subject.name}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="examType">Exam Type</Label>
                <Select defaultValue={selectedExam?.examType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="examDate">Exam Date</Label>
                <Input 
                  id="examDate" 
                  type="date"
                  defaultValue={selectedExam?.examDate ? new Date(selectedExam.examDate).toISOString().split('T')[0] : ''}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input 
                  id="startTime" 
                  type="time"
                  defaultValue={selectedExam?.startTime}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input 
                  id="endTime" 
                  type="time"
                  defaultValue={selectedExam?.endTime}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxMarks">Maximum Marks</Label>
                <Input 
                  id="maxMarks" 
                  type="number" 
                  placeholder="100"
                  defaultValue={selectedExam?.maxMarks}
                />
              </div>
              <div>
                <Label htmlFor="passingMarks">Passing Marks</Label>
                <Input 
                  id="passingMarks" 
                  type="number" 
                  placeholder="40"
                  defaultValue={selectedExam?.passingMarks}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddExamDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle save logic here
                setShowAddExamDialog(false)
              }}>
                {selectedExam ? 'Update' : 'Create'} Exam
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exam Details Dialog */}
      <Dialog open={showExamDetailsDialog} onOpenChange={setShowExamDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Exam Details</DialogTitle>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Exam Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Title:</span>
                      <span className="ml-2">{selectedExam.title}</span>
                    </div>
                    <div>
                      <span className="font-medium">Subject:</span>
                      <span className="ml-2">{selectedExam.subject.name}</span>
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>
                      <Badge className={getExamTypeInfo(selectedExam.examType).color + " ml-2"}>
                        {getExamTypeInfo(selectedExam.examType).label}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="ml-2 text-gray-600">{selectedExam.description}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Schedule & Marks</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium">Date:</span>
                      <span className="ml-2">{formatDate(selectedExam.examDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">Time:</span>
                      <span className="ml-2">
                        {formatTime(selectedExam.startTime)} - {formatTime(selectedExam.endTime)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Maximum Marks:</span>
                      <span className="ml-2">{selectedExam.maxMarks}</span>
                    </div>
                    <div>
                      <span className="font-medium">Passing Marks:</span>
                      <span className="ml-2">{selectedExam.passingMarks}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedExam.results.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Results Summary</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {calculateAverageMarks(selectedExam).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {calculatePassPercentage(selectedExam).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">Pass Rate</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.max(...selectedExam.results.filter(r => !r.isAbsent).map(r => r.marksObtained))}
                      </div>
                      <div className="text-sm text-gray-600">Highest Score</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.min(...selectedExam.results.filter(r => !r.isAbsent).map(r => r.marksObtained))}
                      </div>
                      <div className="text-sm text-gray-600">Lowest Score</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowExamDetailsDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowExamDetailsDialog(false)
                  handleEditExam(selectedExam)
                }}>
                  Edit Exam
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Exam Results</DialogTitle>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{selectedExam.title}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedExam.subject.name} • {formatDate(selectedExam.examDate)}
                  </p>
                </div>
                <Button size="sm">
                  <Calculator className="w-4 h-4 mr-2" />
                  Enter Results
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Marks Obtained</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedExam.results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <div className="font-medium">{result.student.user.name}</div>
                      </TableCell>
                      <TableCell>
                        {result.student.class.name}-{result.student.class.section}
                      </TableCell>
                      <TableCell>
                        {result.isAbsent ? '-' : `${result.marksObtained}/${selectedExam.maxMarks}`}
                      </TableCell>
                      <TableCell>
                        {result.isAbsent ? (
                          <Badge variant="outline">Absent</Badge>
                        ) : (
                          <span className={`font-medium ${getGradeColor(result.grade)}`}>
                            {result.grade}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.isAbsent ? (
                          <Badge className="bg-gray-100 text-gray-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Absent
                          </Badge>
                        ) : result.marksObtained >= selectedExam.passingMarks ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Pass
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Fail
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{result.remarks}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowResultsDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
