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
import {
  BarChart,
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
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle,
  AlertCircle,
  Target,
  Percent,
} from 'lucide-react'

// Mock data for grades
const mockGrades = [
  {
    id: '1',
    studentName: 'Emma Johnson',
    studentId: 'STU001',
    class: 'Grade 10-A',
    subject: 'Mathematics',
    examType: 'Mid-term Exam',
    examDate: '2024-01-15',
    maxMarks: 100,
    obtainedMarks: 85,
    grade: 'A',
    percentage: 85,
    teacher: 'Dr. Emily Johnson',
    status: 'Published',
    feedback: 'Excellent work on algebra problems. Need to improve geometry.',
    submissionDate: '2024-01-15',
    gradedDate: '2024-01-18',
  },
  {
    id: '2',
    studentName: 'Michael Chen',
    studentId: 'STU002',
    class: 'Grade 10-B',
    subject: 'English',
    examType: 'Essay Assignment',
    examDate: '2024-01-20',
    maxMarks: 100,
    obtainedMarks: 78,
    grade: 'B+',
    percentage: 78,
    teacher: 'Ms. Sarah Williams',
    status: 'Published',
    feedback: 'Good analysis of themes. Work on sentence structure.',
    submissionDate: '2024-01-20',
    gradedDate: '2024-01-22',
  },
  {
    id: '3',
    studentName: 'Sarah Williams',
    studentId: 'STU003',
    class: 'Grade 9-A',
    subject: 'Science',
    examType: 'Lab Report',
    examDate: '2024-01-18',
    maxMarks: 50,
    obtainedMarks: 46,
    grade: 'A',
    percentage: 92,
    teacher: 'Dr. Michael Chen',
    status: 'Draft',
    feedback: 'Outstanding lab work and detailed observations.',
    submissionDate: '2024-01-18',
    gradedDate: '2024-01-20',
  },
  {
    id: '4',
    studentName: 'James Rodriguez',
    studentId: 'STU004',
    class: 'Grade 11-A',
    subject: 'History',
    examType: 'Project',
    examDate: '2024-01-25',
    maxMarks: 100,
    obtainedMarks: 72,
    grade: 'B',
    percentage: 72,
    teacher: 'Mr. James Rodriguez',
    status: 'Under Review',
    feedback: 'Good research but needs better organization.',
    submissionDate: '2024-01-25',
    gradedDate: null,
  },
  {
    id: '5',
    studentName: 'Emily Davis',
    studentId: 'STU005',
    class: 'Grade 12-A',
    subject: 'Physics',
    examType: 'Final Exam',
    examDate: '2024-01-30',
    maxMarks: 100,
    obtainedMarks: 94,
    grade: 'A+',
    percentage: 94,
    teacher: 'Dr. Robert Kim',
    status: 'Published',
    feedback: 'Exceptional understanding of complex concepts.',
    submissionDate: '2024-01-30',
    gradedDate: '2024-02-01',
  },
]

export default function GradesPage() {
  const [grades] = useState(mockGrades)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedGrade, setSelectedGrade] = useState<typeof mockGrades[0] | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.examType.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesClass = selectedClass === 'all' || grade.class === selectedClass
    const matchesSubject = selectedSubject === 'all' || grade.subject === selectedSubject
    const matchesStatus = selectedStatus === 'all' || grade.status.toLowerCase() === selectedStatus.toLowerCase()
    
    return matchesSearch && matchesClass && matchesSubject && matchesStatus
  })

  const getGradeColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case 'a+':
        return 'bg-green-100 text-green-800'
      case 'a':
        return 'bg-blue-100 text-blue-800'
      case 'b+':
        return 'bg-cyan-100 text-cyan-800'
      case 'b':
        return 'bg-yellow-100 text-yellow-800'
      case 'c+':
        return 'bg-orange-100 text-orange-800'
      case 'c':
        return 'bg-red-100 text-red-800'
      case 'f':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'under review':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return <CheckCircle className="w-4 h-4" />
      case 'draft':
        return <AlertCircle className="w-4 h-4" />
      case 'under review':
        return <Eye className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getPercentageIcon = (percentage: number) => {
    if (percentage >= 80) return <TrendingUp className="w-4 h-4" />
    if (percentage >= 60) return <Target className="w-4 h-4" />
    return <TrendingDown className="w-4 h-4" />
  }

  const calculateStats = () => {
    const avgGrade = grades.reduce((acc, grade) => acc + grade.percentage, 0) / grades.length
    const publishedGrades = grades.filter(g => g.status === 'Published').length
    const highPerformers = grades.filter(g => g.percentage >= 90).length
    const needsImprovement = grades.filter(g => g.percentage < 60).length

    return {
      avgGrade: Math.round(avgGrade),
      publishedGrades,
      highPerformers,
      needsImprovement,
    }
  }

  const stats = calculateStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grades & Assessment</h1>
          <p className="text-gray-600">Manage student grades, assessments, and performance analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Grades
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Grade
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Grades</p>
                <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgGrade}%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Performers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.highPerformers}</p>
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
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedGrades}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-orange-600" />
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
                placeholder="Search grades..."
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
                <SelectItem value="Physics">Physics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="under review">Under Review</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grades List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="w-5 h-5 mr-2" />
            Student Grades ({filteredGrades.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredGrades.map(grade => (
              <div key={grade.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{grade.studentName}</h3>
                      <Badge variant="outline">{grade.studentId}</Badge>
                      <Badge className={getGradeColor(grade.grade)}>
                        {grade.grade}
                      </Badge>
                      <Badge className={getStatusColor(grade.status)}>
                        {getStatusIcon(grade.status)}
                        <span className="ml-1">{grade.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {grade.subject}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {grade.class}
                      </span>
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {grade.examType}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {grade.examDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm font-medium">Score</div>
                      <div className="text-sm text-gray-600">
                        {grade.obtainedMarks}/{grade.maxMarks}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Percentage</div>
                      <div className={`text-sm flex items-center ${getPercentageColor(grade.percentage)}`}>
                        {getPercentageIcon(grade.percentage)}
                        <span className="ml-1">{grade.percentage}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Teacher</div>
                      <div className="text-sm text-gray-600">{grade.teacher}</div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedGrade(grade)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Grade
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View Submission
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download Report
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Grade
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

      {/* Grade Details Dialog */}
      <Dialog open={!!selectedGrade} onOpenChange={() => setSelectedGrade(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Grade Details</DialogTitle>
            <DialogDescription>
              Assessment information for {selectedGrade?.studentName}
            </DialogDescription>
          </DialogHeader>
          {selectedGrade && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedGrade.studentName}</h3>
                  <p className="text-gray-600">{selectedGrade.studentId} • {selectedGrade.class}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getGradeColor(selectedGrade.grade)}>
                    {selectedGrade.grade}
                  </Badge>
                  <Badge className={getStatusColor(selectedGrade.status)}>
                    {getStatusIcon(selectedGrade.status)}
                    <span className="ml-1">{selectedGrade.status}</span>
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Assessment Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Subject:</strong> {selectedGrade.subject}</p>
                    <p><strong>Exam Type:</strong> {selectedGrade.examType}</p>
                    <p><strong>Exam Date:</strong> {selectedGrade.examDate}</p>
                    <p><strong>Teacher:</strong> {selectedGrade.teacher}</p>
                    <p><strong>Submission Date:</strong> {selectedGrade.submissionDate}</p>
                    <p><strong>Graded Date:</strong> {selectedGrade.gradedDate || 'Not graded yet'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Score Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Maximum Marks:</strong> {selectedGrade.maxMarks}</p>
                    <p><strong>Obtained Marks:</strong> {selectedGrade.obtainedMarks}</p>
                    <p><strong>Percentage:</strong> {selectedGrade.percentage}%</p>
                    <p><strong>Letter Grade:</strong> {selectedGrade.grade}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Teacher Feedback</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedGrade.feedback}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedGrade.obtainedMarks}</div>
                  <div className="text-sm text-gray-600">Marks Obtained</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedGrade.percentage}%</div>
                  <div className="text-sm text-gray-600">Percentage</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedGrade.grade}</div>
                  <div className="text-sm text-gray-600">Letter Grade</div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setSelectedGrade(null)}>
                  Close
                </Button>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Grade
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Grade Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Grade</DialogTitle>
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
                    <SelectItem value="physics">Physics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="examType">Exam Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="midterm">Mid-term Exam</SelectItem>
                    <SelectItem value="final">Final Exam</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="examDate">Exam Date</Label>
                <Input id="examDate" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxMarks">Maximum Marks</Label>
                <Input id="maxMarks" type="number" placeholder="Enter max marks" />
              </div>
              <div>
                <Label htmlFor="obtainedMarks">Obtained Marks</Label>
                <Input id="obtainedMarks" type="number" placeholder="Enter obtained marks" />
              </div>
            </div>
            <div>
              <Label htmlFor="feedback">Teacher Feedback</Label>
              <Textarea id="feedback" placeholder="Enter feedback for the student" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddDialog(false)}>
                Add Grade
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
