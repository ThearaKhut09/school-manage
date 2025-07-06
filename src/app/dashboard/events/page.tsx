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
import { Calendar } from '@/components/ui/calendar'
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
  Calendar as CalendarIcon,
  Bell,
  Clock,
  MapPin,
  Users,
  PartyPopper,
  GraduationCap,
  Trophy,
  Music,
  AlertCircle,
  BookOpen,
  Activity,
  MessageCircle,
  Share2,
  ThumbsUp,
  Send,
} from 'lucide-react'

interface Event {
  id: string
  schoolId: string
  title: string
  description: string
  startDate: string
  endDate: string | null
  location: string | null
  eventType: 'ACADEMIC' | 'SPORTS' | 'CULTURAL' | 'HOLIDAY' | 'MEETING' | 'EXAMINATION' | 'OTHER'
  isActive: boolean
  school: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface Announcement {
  id: string
  title: string
  message: string
  type: 'general' | 'urgent' | 'academic' | 'sports' | 'cultural'
  author: string
  date: string
  isActive: boolean
  targetAudience: 'all' | 'students' | 'teachers' | 'parents'
  priority: 'low' | 'medium' | 'high'
}

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    schoolId: 'school1',
    title: 'Annual Sports Day',
    description: 'Annual sports competition with various athletic events for all grade levels.',
    startDate: '2024-02-15T09:00:00.000Z',
    endDate: '2024-02-15T17:00:00.000Z',
    location: 'Main Sports Ground',
    eventType: 'SPORTS',
    isActive: true,
    school: {
      id: 'school1',
      name: 'Springfield High School'
    },
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    schoolId: 'school1',
    title: 'Parent-Teacher Meeting',
    description: 'Monthly parent-teacher conference to discuss student progress.',
    startDate: '2024-01-30T14:00:00.000Z',
    endDate: '2024-01-30T18:00:00.000Z',
    location: 'School Auditorium',
    eventType: 'MEETING',
    isActive: true,
    school: {
      id: 'school1',
      name: 'Springfield High School'
    },
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: '3',
    schoolId: 'school1',
    title: 'Science Fair',
    description: 'Student science project exhibition and competition.',
    startDate: '2024-03-10T10:00:00.000Z',
    endDate: '2024-03-10T16:00:00.000Z',
    location: 'Science Laboratory',
    eventType: 'ACADEMIC',
    isActive: true,
    school: {
      id: 'school1',
      name: 'Springfield High School'
    },
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
  },
  {
    id: '4',
    schoolId: 'school1',
    title: 'Cultural Festival',
    description: 'Annual cultural celebration with music, dance, and drama performances.',
    startDate: '2024-04-05T18:00:00.000Z',
    endDate: '2024-04-05T22:00:00.000Z',
    location: 'School Auditorium',
    eventType: 'CULTURAL',
    isActive: true,
    school: {
      id: 'school1',
      name: 'Springfield High School'
    },
    createdAt: '2024-01-25T00:00:00.000Z',
    updatedAt: '2024-01-25T00:00:00.000Z',
  },
]

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'New COVID-19 Safety Guidelines',
    message: 'Updated safety protocols for the new semester. All students and staff must follow the new guidelines.',
    type: 'urgent',
    author: 'Principal Johnson',
    date: '2024-01-15T09:00:00.000Z',
    isActive: true,
    targetAudience: 'all',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Library Extended Hours',
    message: 'The library will now be open until 8 PM on weekdays to support student study needs.',
    type: 'general',
    author: 'Ms. Wilson',
    date: '2024-01-14T10:30:00.000Z',
    isActive: true,
    targetAudience: 'students',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Basketball Team Tryouts',
    message: 'Basketball team tryouts for the upcoming season. Sign up at the sports office.',
    type: 'sports',
    author: 'Coach Smith',
    date: '2024-01-13T14:00:00.000Z',
    isActive: true,
    targetAudience: 'students',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'PTA Meeting Schedule',
    message: 'Parent-Teacher Association meeting scheduled for next Friday at 7 PM in the auditorium.',
    type: 'general',
    author: 'PTA President',
    date: '2024-01-12T16:00:00.000Z',
    isActive: true,
    targetAudience: 'parents',
    priority: 'medium',
  },
]

const eventTypes = [
  { value: 'ACADEMIC', label: 'Academic', icon: BookOpen, color: 'bg-blue-100 text-blue-800' },
  { value: 'SPORTS', label: 'Sports', icon: Trophy, color: 'bg-green-100 text-green-800' },
  { value: 'CULTURAL', label: 'Cultural', icon: Music, color: 'bg-purple-100 text-purple-800' },
  { value: 'HOLIDAY', label: 'Holiday', icon: PartyPopper, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'MEETING', label: 'Meeting', icon: Users, color: 'bg-gray-100 text-gray-800' },
  { value: 'EXAMINATION', label: 'Examination', icon: GraduationCap, color: 'bg-red-100 text-red-800' },
  { value: 'OTHER', label: 'Other', icon: Activity, color: 'bg-orange-100 text-orange-800' },
]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents)
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEventType, setSelectedEventType] = useState<string>('')
  const [selectedAudience, setSelectedAudience] = useState<string>('')
  const [selectedPriority, setSelectedPriority] = useState<string>('')
  const [showAddEventDialog, setShowAddEventDialog] = useState(false)
  const [showAddAnnouncementDialog, setShowAddAnnouncementDialog] = useState(false)
  const [showEventDetailsDialog, setShowEventDetailsDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState('events')

  // Filter events and announcements
  useEffect(() => {
    let filteredE = events
    let filteredA = announcements

    if (searchTerm) {
      filteredE = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      
      filteredA = announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedEventType) {
      filteredE = filteredE.filter(event => event.eventType === selectedEventType)
    }

    if (selectedAudience) {
      filteredA = filteredA.filter(announcement => announcement.targetAudience === selectedAudience)
    }

    if (selectedPriority) {
      filteredA = filteredA.filter(announcement => announcement.priority === selectedPriority)
    }

    setFilteredEvents(filteredE)
    setFilteredAnnouncements(filteredA)
  }, [searchTerm, selectedEventType, selectedAudience, selectedPriority, events, announcements])

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setShowAddEventDialog(true)
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setShowAddEventDialog(true)
  }

  const handleViewEventDetails = (event: Event) => {
    setSelectedEvent(event)
    setShowEventDetailsDialog(true)
  }

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(event => event.id !== eventId))
    }
  }

  const handleDeleteAnnouncement = (announcementId: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== announcementId))
    }
  }

  const getEventTypeInfo = (eventType: string) => {
    return eventTypes.find(type => type.value === eventType) || eventTypes[eventTypes.length - 1]
  }

  const getAnnouncementTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'academic': return 'bg-blue-100 text-blue-800'
      case 'sports': return 'bg-green-100 text-green-800'
      case 'cultural': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events & Announcements</h1>
          <p className="text-gray-600">Manage school events, announcements, and communications</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Events
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Calendar
          </Button>
          <Button variant="outline" size="sm">
            <Send className="w-4 h-4 mr-2" />
            Send Notifications
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Announcements</p>
                <p className="text-2xl font-bold text-gray-900">
                  {announcements.filter(a => a.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter(e => new Date(e.startDate) > new Date()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Urgent Announcements</p>
                <p className="text-2xl font-bold text-gray-900">
                  {announcements.filter(a => a.priority === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Event Filters
                </div>
                <Button size="sm" onClick={handleAddEvent}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
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
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      {eventTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
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

          {/* Events Table */}
          <Card>
            <CardHeader>
              <CardTitle>School Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => {
                    const typeInfo = getEventTypeInfo(event.eventType)
                    const Icon = typeInfo.icon
                    return (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {event.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={typeInfo.color}>
                            <Icon className="w-3 h-3 mr-1" />
                            {typeInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{formatDate(event.startDate)}</div>
                            <div className="text-gray-500">
                              {formatTime(event.startDate)}
                              {event.endDate && ` - ${formatTime(event.endDate)}`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                            {event.location || 'TBD'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={event.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {event.isActive ? 'Active' : 'Inactive'}
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
                              <DropdownMenuItem onClick={() => handleViewEventDetails(event)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" />
                                Send Reminder
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteEvent(event.id)}
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

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Announcement Filters
                </div>
                <Button size="sm" onClick={() => setShowAddAnnouncementDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Announcement
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search announcements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="audience">Target Audience</Label>
                  <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                    <SelectTrigger>
                      <SelectValue placeholder="All audiences" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All audiences</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="teachers">Teachers</SelectItem>
                      <SelectItem value="parents">Parents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
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

          {/* Announcements List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Badge className={getAnnouncementTypeColor(announcement.type)}>
                            {announcement.type}
                          </Badge>
                          <Badge className={getPriorityColor(announcement.priority)} variant="outline">
                            {announcement.priority} priority
                          </Badge>
                          <span className="text-sm text-gray-500 ml-2">
                            {announcement.targetAudience}
                          </span>
                        </div>
                        <h3 className="font-medium text-lg mb-2">{announcement.title}</h3>
                        <p className="text-gray-600 mb-3">{announcement.message}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>By {announcement.author}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDateTime(announcement.date)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" />
                              Resend
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  Events for {selectedDate?.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events
                    .filter(event => 
                      selectedDate && 
                      new Date(event.startDate).toDateString() === selectedDate.toDateString()
                    )
                    .map((event) => {
                      const typeInfo = getEventTypeInfo(event.eventType)
                      const Icon = typeInfo.icon
                      return (
                        <div key={event.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-2 text-gray-400" />
                              <div>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-sm text-gray-500">
                                  {formatTime(event.startDate)}
                                  {event.endDate && ` - ${formatTime(event.endDate)}`}
                                </div>
                              </div>
                            </div>
                            <Badge className={typeInfo.color}>
                              {typeInfo.label}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  {events.filter(event => 
                    selectedDate && 
                    new Date(event.startDate).toDateString() === selectedDate.toDateString()
                  ).length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No events scheduled for this date
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Event Dialog */}
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? 'Edit Event' : 'Add New Event'}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent ? 'Update the event details.' : 'Create a new school event.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input 
                id="title" 
                placeholder="Annual Sports Day"
                defaultValue={selectedEvent?.title}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Event description..."
                defaultValue={selectedEvent?.description}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Select defaultValue={selectedEvent?.eventType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="School Auditorium"
                  defaultValue={selectedEvent?.location || ''}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date & Time</Label>
                <Input 
                  id="startDate" 
                  type="datetime-local"
                  defaultValue={selectedEvent?.startDate ? new Date(selectedEvent.startDate).toISOString().slice(0, 16) : ''}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date & Time</Label>
                <Input 
                  id="endDate" 
                  type="datetime-local"
                  defaultValue={selectedEvent?.endDate ? new Date(selectedEvent.endDate).toISOString().slice(0, 16) : ''}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddEventDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle save logic here
                setShowAddEventDialog(false)
              }}>
                {selectedEvent ? 'Update' : 'Create'} Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Announcement Dialog */}
      <Dialog open={showAddAnnouncementDialog} onOpenChange={setShowAddAnnouncementDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Announcement</DialogTitle>
            <DialogDescription>
              Create a new announcement for the school community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="announcementTitle">Title</Label>
              <Input id="announcementTitle" placeholder="Important announcement..." />
            </div>
            <div>
              <Label htmlFor="announcementMessage">Message</Label>
              <Textarea id="announcementMessage" placeholder="Announcement message..." />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="announcementType">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="teachers">Teachers</SelectItem>
                    <SelectItem value="parents">Parents</SelectItem>
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
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddAnnouncementDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle save logic here
                setShowAddAnnouncementDialog(false)
              }}>
                Create Announcement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={showEventDetailsDialog} onOpenChange={setShowEventDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Event Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Title:</span>
                      <span className="ml-2">{selectedEvent.title}</span>
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="ml-2 text-gray-600">{selectedEvent.description}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Type:</span>
                      <Badge className={getEventTypeInfo(selectedEvent.eventType).color + " ml-2"}>
                        {getEventTypeInfo(selectedEvent.eventType).label}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="font-medium">Location:</span>
                      <span className="ml-2">{selectedEvent.location || 'TBD'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Schedule</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span className="font-medium">Start:</span>
                      <span className="ml-2">{formatDateTime(selectedEvent.startDate)}</span>
                    </div>
                    {selectedEvent.endDate && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="font-medium">End:</span>
                        <span className="ml-2">{formatDateTime(selectedEvent.endDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEventDetailsDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowEventDetailsDialog(false)
                  handleEditEvent(selectedEvent)
                }}>
                  Edit Event
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
