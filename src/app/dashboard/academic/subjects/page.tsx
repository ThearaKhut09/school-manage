'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  Users,
  Clock,
  Award,
} from 'lucide-react'

interface Subject {
  id: string
  name: string
  code: string
  description: string
  credits: number
  isActive: boolean
  teacher: {
    id: string
    user: {
      firstName: string
      lastName: string
    }
  }
  classes: Array<{
    id: string
    name: string
    section: string
  }>
  _count: {
    assignments: number
    exams: number
  }
}

interface Teacher {
  id: string
  user: {
    firstName: string
    lastName: string
  }
}

const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    code: 'MATH101',
    description: 'Algebra and Geometry fundamentals',
    credits: 4,
    isActive: true,
    teacher: {
      id: '1',
      user: {
        firstName: 'John',
        lastName: 'Smith'
      }
    },
    classes: [
      { id: '1', name: 'Grade 10', section: 'A' },
      { id: '2', name: 'Grade 10', section: 'B' }
    ],
    _count: {
      assignments: 12,
      exams: 4
    }
  },
  {
    id: '2',
    name: 'English Literature',
    code: 'ENG201',
    description: 'Classic and modern literature analysis',
    credits: 3,
    isActive: true,
    teacher: {
      id: '2',
      user: {
        firstName: 'Sarah',
        lastName: 'Johnson'
      }
    },
    classes: [
      { id: '1', name: 'Grade 10', section: 'A' }
    ],
    _count: {
      assignments: 8,
      exams: 3
    }
  }
]

const mockTeachers: Teacher[] = [
  {
    id: '1',
    user: {
      firstName: 'John',
      lastName: 'Smith'
    }
  },
  {
    id: '2',
    user: {
      firstName: 'Sarah',
      lastName: 'Johnson'
    }
  }
]

export default function SubjectsPage() {
  const [subjects] = useState(mockSubjects)
  const [teachers] = useState(mockTeachers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && subject.isActive) ||
                         (selectedStatus === 'inactive' && !subject.isActive)
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subjects</h1>
          <p className="text-gray-600 mt-1">Manage subjects and curriculum</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Subjects</p>
                <p className="text-2xl font-bold">{subjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Subjects</p>
                <p className="text-2xl font-bold">{subjects.filter(s => s.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold">{subjects.reduce((sum, s) => sum + s.credits, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Assignments</p>
                <p className="text-2xl font-bold">
                  {Math.round(subjects.reduce((sum, s) => sum + s._count.assignments, 0) / subjects.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                  <p className="text-sm text-gray-600">{subject.code}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={subject.isActive ? "default" : "secondary"}>
                    {subject.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSelectedSubject(subject)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{subject.description}</p>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Teacher:</span>
                  <span>{subject.teacher.user.firstName} {subject.teacher.user.lastName}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Credits:</span>
                  <span className="font-medium">{subject.credits}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Classes:</span>
                  <span>{subject.classes.length}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-sm font-medium text-blue-600">{subject._count.assignments}</p>
                    <p className="text-xs text-blue-500">Assignments</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-sm font-medium text-green-600">{subject._count.exams}</p>
                    <p className="text-xs text-green-500">Exams</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Subject Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
            <DialogDescription>
              Create a new subject for the curriculum
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject Name</label>
                <Input placeholder="Enter subject name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject Code</label>
                <Input placeholder="e.g., MATH101" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input placeholder="Subject description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Credits</label>
                <Input type="number" placeholder="Credits" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teacher</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.user.firstName} {teacher.user.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddDialog(false)}>
                Add Subject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={!!selectedSubject} onOpenChange={() => setSelectedSubject(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Modify subject details
            </DialogDescription>
          </DialogHeader>
          {selectedSubject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject Name</label>
                  <Input defaultValue={selectedSubject.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject Code</label>
                  <Input defaultValue={selectedSubject.code} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input defaultValue={selectedSubject.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Credits</label>
                  <Input type="number" defaultValue={selectedSubject.credits} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select defaultValue={selectedSubject.isActive ? "active" : "inactive"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedSubject(null)}>
                  Cancel
                </Button>
                <Button onClick={() => setSelectedSubject(null)}>
                  Update Subject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
