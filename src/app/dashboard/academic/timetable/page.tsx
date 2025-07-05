'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Download,
  Wand2,
  Users,
  MapPin,
} from 'lucide-react'

// Type definition for timetable entries
type TimetableEntry = {
  id: string
  day: string
  period: number
  time: string
  subject: string
  teacher: string
  class: string
  room: string
  color: string
}

// Mock data for timetable
const mockTimetable: TimetableEntry[] = [
  {
    id: '1',
    day: 'Monday',
    period: 1,
    time: '9:00 - 9:50',
    subject: 'Mathematics',
    teacher: 'Dr. Smith',
    class: 'Grade 10-A',
    room: 'Room 101',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    id: '2',
    day: 'Monday',
    period: 2,
    time: '9:50 - 10:40',
    subject: 'English',
    teacher: 'Ms. Johnson',
    class: 'Grade 10-A',
    room: 'Room 102',
    color: 'bg-green-100 text-green-800',
  },
  {
    id: '3',
    day: 'Monday',
    period: 3,
    time: '10:40 - 11:30',
    subject: 'Science',
    teacher: 'Dr. Brown',
    class: 'Grade 10-A',
    room: 'Lab 1',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    id: '4',
    day: 'Monday',
    period: 4,
    time: '11:30 - 12:20',
    subject: 'History',
    teacher: 'Mr. Davis',
    class: 'Grade 10-A',
    room: 'Room 104',
    color: 'bg-orange-100 text-orange-800',
  },
  {
    id: '5',
    day: 'Tuesday',
    period: 1,
    time: '9:00 - 9:50',
    subject: 'Science',
    teacher: 'Dr. Brown',
    class: 'Grade 10-A',
    room: 'Lab 1',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    id: '6',
    day: 'Tuesday',
    period: 2,
    time: '9:50 - 10:40',
    subject: 'Mathematics',
    teacher: 'Dr. Smith',
    class: 'Grade 10-A',
    room: 'Room 101',
    color: 'bg-blue-100 text-blue-800',
  },
]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const periods = [
  { number: 1, time: '9:00 - 9:50' },
  { number: 2, time: '9:50 - 10:40' },
  { number: 3, time: '10:40 - 11:30' },
  { number: 4, time: '11:30 - 12:20' },
  { number: 5, time: '1:20 - 2:10' },
  { number: 6, time: '2:10 - 3:00' },
  { number: 7, time: '3:00 - 3:50' },
  { number: 8, time: '3:50 - 4:40' },
]

const subjects = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Physical Education',
  'Art',
  'Music',
]

const teachers = [
  'Dr. Smith',
  'Ms. Johnson',
  'Dr. Brown',
  'Mr. Davis',
  'Prof. Wilson',
  'Ms. Garcia',
  'Dr. Martinez',
  'Mr. Anderson',
]

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState('Grade 10-A')
  const [timetable, setTimetable] = useState(mockTimetable)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; period: number } | null>(null)
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null)

  const getTimetableEntry = (day: string, period: number) => {
    return timetable.find(entry => 
      entry.day === day && 
      entry.period === period && 
      entry.class === selectedClass
    )
  }

  const handleAddEntry = (day: string, period: number) => {
    setSelectedSlot({ day, period })
    setEditingEntry(null)
    setShowAddDialog(true)
  }

  const handleEditEntry = (entry: TimetableEntry) => {
    setEditingEntry(entry)
    setShowAddDialog(true)
  }

  const handleDeleteEntry = (entryId: string) => {
    setTimetable(prev => prev.filter(entry => entry.id !== entryId))
  }

  const generateAITimetable = () => {
    // AI-powered timetable generation logic would go here
    alert('AI Timetable Generation feature will be implemented with OpenAI API integration')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable Management</h1>
          <p className="text-gray-600">Create and manage class schedules with AI assistance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Timetable
          </Button>
          <Button variant="outline" size="sm" onClick={generateAITimetable}>
            <Wand2 className="w-4 h-4 mr-2" />
            Generate with AI
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Period
          </Button>
        </div>
      </div>

      {/* Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Select Class
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
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
            <div className="text-sm text-gray-600">
              Showing timetable for {selectedClass}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Weekly Timetable - {selectedClass}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-3 bg-gray-50 text-left font-medium">
                    Time/Day
                  </th>
                  {days.map(day => (
                    <th key={day} className="border border-gray-300 p-3 bg-gray-50 text-center font-medium min-w-[200px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map(period => (
                  <tr key={period.number}>
                    <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                      <div className="text-sm">
                        <div>Period {period.number}</div>
                        <div className="text-gray-500">{period.time}</div>
                      </div>
                    </td>
                    {days.map(day => {
                      const entry = getTimetableEntry(day, period.number)
                      return (
                        <td key={`${day}-${period.number}`} className="border border-gray-300 p-2 h-24 relative">
                          {entry ? (
                            <div className={`h-full rounded-lg p-2 ${entry.color} relative group cursor-pointer`}>
                              <div className="text-sm font-medium">{entry.subject}</div>
                              <div className="text-xs">{entry.teacher}</div>
                              <div className="text-xs flex items-center mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {entry.room}
                              </div>
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => handleEditEntry(entry)}
                                    className="p-1 bg-white rounded shadow hover:bg-gray-50"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEntry(entry.id)}
                                    className="p-1 bg-white rounded shadow hover:bg-gray-50 text-red-600"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors"
                              onClick={() => handleAddEntry(day, period.number)}
                            >
                              <Plus className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Period Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? 'Edit Period' : 'Add New Period'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="day">Day</Label>
                <Select defaultValue={editingEntry?.day || selectedSlot?.day}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="period">Period</Label>
                <Select defaultValue={editingEntry?.period?.toString() || selectedSlot?.period?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map(period => (
                      <SelectItem key={period.number} value={period.number.toString()}>
                        {period.number} ({period.time})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select defaultValue={editingEntry?.subject}>
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
              <Label htmlFor="teacher">Teacher</Label>
              <Select defaultValue={editingEntry?.teacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                placeholder="Enter room number"
                defaultValue={editingEntry?.room}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle save logic here
                setShowAddDialog(false)
                setEditingEntry(null)
                setSelectedSlot(null)
              }}>
                {editingEntry ? 'Update' : 'Add'} Period
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
