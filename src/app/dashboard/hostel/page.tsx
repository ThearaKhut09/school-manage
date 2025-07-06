'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Bed, 
  Home,
  Phone,
  MapPin,
  UserCheck,
  Calendar,
  CheckCircle,
  Key,
  CreditCard
} from 'lucide-react'

interface Hostel {
  id: number
  name: string
  type: 'boys' | 'girls' | 'mixed'
  capacity: number
  occupied: number
  warden: string
  contact: string
  address: string
  facilities: string[]
  status: string
}

interface Room {
  id: number
  hostelId: number
  hostelName: string
  roomNumber: string
  type: 'single' | 'double' | 'triple'
  capacity: number
  occupied: number
  floor: number
  rent: number
  facilities: string[]
  status: 'available' | 'occupied' | 'partially_occupied'
}

interface Student {
  id: number
  studentId: string
  name: string
  email: string
  phone: string
  hostelId: number
  hostelName: string
  roomId: number
  roomNumber: string
  checkInDate: string
  checkOutDate: string | null
  status: string
  emergencyContact: {
    name: string
    phone: string
    relation: string
  }
  feeStatus: string
  lastPayment: string
  monthlyRent: number
}

interface HostelStats {
  totalHostels: number
  totalCapacity: number
  totalOccupied: number
  occupancyRate: number
}

export default function HostelPage() {
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [stats, setStats] = useState<HostelStats>({
    totalHostels: 0,
    totalCapacity: 0,
    totalOccupied: 0,
    occupancyRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isHostelDialogOpen, setIsHostelDialogOpen] = useState(false)
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false)
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('hostels')

  useEffect(() => {
    fetchHostels()
    fetchRooms()
    fetchStudents()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchHostels = async () => {
    try {
      const response = await fetch('/api/hostel?type=hostels')
      const data = await response.json()
      setHostels(data.hostels || [])
      setStats(data.stats || stats)
    } catch (error) {
      console.error('Error fetching hostels:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/hostel?type=rooms')
      const data = await response.json()
      setRooms(data.rooms || [])
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/hostel?type=students')
      const data = await response.json()
      setStudents(data.students || [])
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const handleHostelSave = async (hostelData: Partial<Hostel>) => {
    try {
      const method = selectedHostel ? 'PUT' : 'POST'
      const url = '/api/hostel'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'hostel',
          id: selectedHostel?.id,
          ...hostelData
        }),
      })

      if (response.ok) {
        fetchHostels()
        setIsHostelDialogOpen(false)
        setSelectedHostel(null)
      }
    } catch (error) {
      console.error('Error saving hostel:', error)
    }
  }

  const handleRoomSave = async (roomData: Partial<Room>) => {
    try {
      const method = selectedRoom ? 'PUT' : 'POST'
      const url = '/api/hostel'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'room',
          id: selectedRoom?.id,
          ...roomData
        }),
      })

      if (response.ok) {
        fetchRooms()
        setIsRoomDialogOpen(false)
        setSelectedRoom(null)
      }
    } catch (error) {
      console.error('Error saving room:', error)
    }
  }

  const handleStudentSave = async (studentData: Partial<Student>) => {
    try {
      const method = selectedStudent ? 'PUT' : 'POST'
      const url = '/api/hostel'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'student',
          id: selectedStudent?.id,
          ...studentData
        }),
      })

      if (response.ok) {
        fetchStudents()
        fetchRooms()
        fetchHostels()
        setIsStudentDialogOpen(false)
        setSelectedStudent(null)
      }
    } catch (error) {
      console.error('Error saving student:', error)
    }
  }

  const handleHostelDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/hostel?type=hostel&id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchHostels()
      }
    } catch (error) {
      console.error('Error deleting hostel:', error)
    }
  }

  const handleRoomDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/hostel?type=room&id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchRooms()
      }
    } catch (error) {
      console.error('Error deleting room:', error)
    }
  }

  const handleStudentCheckout = async (id: number) => {
    try {
      const response = await fetch(`/api/hostel?type=student&id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchStudents()
        fetchRooms()
        fetchHostels()
      }
    } catch (error) {
      console.error('Error checking out student:', error)
    }
  }

  const filteredHostels = hostels.filter(hostel => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hostel.warden.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !typeFilter || hostel.type === typeFilter
    const matchesStatus = !statusFilter || hostel.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.hostelName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || room.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || student.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'occupied':
        return 'bg-blue-100 text-blue-800'
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'partially_occupied':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const HostelDialog = ({ hostel, onSave, onClose }: { hostel?: Hostel; onSave: (data: Partial<Hostel>) => void; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: hostel?.name || '',
      type: hostel?.type || 'boys' as const,
      capacity: hostel?.capacity || 50,
      warden: hostel?.warden || '',
      contact: hostel?.contact || '',
      address: hostel?.address || '',
      facilities: hostel?.facilities || []
    })

    const [selectedFacilities, setSelectedFacilities] = useState<string[]>(hostel?.facilities || [])

    const availableFacilities = ['WiFi', 'Laundry', 'Recreation Room', 'Study Hall', 'Cafeteria', 'Gym', 'Conference Room', 'Library', 'Common Kitchen', 'Parking']

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave({ ...formData, facilities: selectedFacilities })
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Hostel Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value: 'boys' | 'girls' | 'mixed') => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boys">Boys</SelectItem>
                <SelectItem value="girls">Girls</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              min="1"
              required
            />
          </div>
          <div>
            <Label htmlFor="warden">Warden</Label>
            <Input
              id="warden"
              value={formData.warden}
              onChange={(e) => setFormData({ ...formData, warden: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Facilities</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {availableFacilities.map((facility) => (
              <div key={facility} className="flex items-center space-x-2">
                <Checkbox
                  id={facility}
                  checked={selectedFacilities.includes(facility)}
                  onCheckedChange={(checked: boolean) => {
                    if (checked) {
                      setSelectedFacilities([...selectedFacilities, facility])
                    } else {
                      setSelectedFacilities(selectedFacilities.filter(f => f !== facility))
                    }
                  }}
                />
                <Label htmlFor={facility} className="text-sm">
                  {facility}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {hostel ? 'Update Hostel' : 'Add Hostel'}
          </Button>
        </div>
      </form>
    )
  }

  const RoomDialog = ({ room, onSave, onClose }: { room?: Room; onSave: (data: Partial<Room>) => void; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      hostelId: room?.hostelId || hostels[0]?.id || 0,
      roomNumber: room?.roomNumber || '',
      type: room?.type || 'single' as const,
      capacity: room?.capacity || 1,
      floor: room?.floor || 1,
      rent: room?.rent || 500,
      facilities: room?.facilities || []
    })

    const [selectedFacilities, setSelectedFacilities] = useState<string[]>(room?.facilities || [])

    const availableFacilities = ['Bed', 'Beds', 'Study Table', 'Study Tables', 'Wardrobe', 'Wardrobes', 'Fan', 'AC', 'Balcony', 'Attached Bathroom']

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const selectedHostel = hostels.find(h => h.id === formData.hostelId)
      onSave({ 
        ...formData, 
        facilities: selectedFacilities,
        hostelName: selectedHostel?.name || ''
      })
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hostelId">Hostel</Label>
            <Select value={formData.hostelId.toString()} onValueChange={(value) => setFormData({ ...formData, hostelId: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue placeholder="Select hostel" />
              </SelectTrigger>
              <SelectContent>
                {hostels.map((hostel) => (
                  <SelectItem key={hostel.id} value={hostel.id.toString()}>
                    {hostel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="roomNumber">Room Number</Label>
            <Input
              id="roomNumber"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value: 'single' | 'double' | 'triple') => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="double">Double</SelectItem>
                <SelectItem value="triple">Triple</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              min="1"
              max="3"
              required
            />
          </div>
          <div>
            <Label htmlFor="floor">Floor</Label>
            <Input
              id="floor"
              type="number"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
              min="1"
              required
            />
          </div>
          <div>
            <Label htmlFor="rent">Monthly Rent ($)</Label>
            <Input
              id="rent"
              type="number"
              value={formData.rent}
              onChange={(e) => setFormData({ ...formData, rent: parseInt(e.target.value) })}
              min="1"
              required
            />
          </div>
        </div>
        <div>
          <Label>Room Facilities</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {availableFacilities.map((facility) => (
              <div key={facility} className="flex items-center space-x-2">
                <Checkbox
                  id={facility}
                  checked={selectedFacilities.includes(facility)}
                  onCheckedChange={(checked: boolean) => {
                    if (checked) {
                      setSelectedFacilities([...selectedFacilities, facility])
                    } else {
                      setSelectedFacilities(selectedFacilities.filter(f => f !== facility))
                    }
                  }}
                />
                <Label htmlFor={facility} className="text-sm">
                  {facility}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {room ? 'Update Room' : 'Add Room'}
          </Button>
        </div>
      </form>
    )
  }

  const StudentDialog = ({ student, onSave, onClose }: { student?: Student; onSave: (data: Partial<Student>) => void; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      studentId: student?.studentId || '',
      name: student?.name || '',
      email: student?.email || '',
      phone: student?.phone || '',
      roomId: student?.roomId || 0,
      emergencyContact: student?.emergencyContact || {
        name: '',
        phone: '',
        relation: ''
      }
    })

    const availableRooms = rooms.filter(room => room.status === 'available' || room.status === 'partially_occupied')

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="roomId">Room</Label>
            <Select value={formData.roomId.toString()} onValueChange={(value) => setFormData({ ...formData, roomId: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map((room) => (
                  <SelectItem key={room.id} value={room.id.toString()}>
                    {room.hostelName} - {room.roomNumber} (${room.rent}/month)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Emergency Contact</Label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <Label htmlFor="emergencyName">Name</Label>
              <Input
                id="emergencyName"
                value={formData.emergencyContact.name}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="emergencyPhone">Phone</Label>
              <Input
                id="emergencyPhone"
                value={formData.emergencyContact.phone}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="emergencyRelation">Relation</Label>
              <Select 
                value={formData.emergencyContact.relation} 
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  emergencyContact: { ...formData.emergencyContact, relation: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Father">Father</SelectItem>
                  <SelectItem value="Mother">Mother</SelectItem>
                  <SelectItem value="Guardian">Guardian</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {student ? 'Update Student' : 'Check In Student'}
          </Button>
        </div>
      </form>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hostel Management</h1>
          <p className="text-gray-600 mt-2">Manage hostels, rooms, and student accommodations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Check-in Report
          </Button>
          <Button variant="outline" size="sm">
            <CreditCard className="w-4 h-4 mr-2" />
            Fee Collection
          </Button>
        </div>
      </div>

      {/* Hostel Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
            <Building className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHostels}</div>
            <p className="text-xs text-gray-600">Active hostels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Bed className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCapacity}</div>
            <p className="text-xs text-gray-600">Available beds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOccupied}</div>
            <p className="text-xs text-gray-600">Students residing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            <p className="text-xs text-gray-600">Current occupancy</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="hostels">Hostels</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="hostels" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Hostels</CardTitle>
                  <CardDescription>
                    Manage hostel buildings and facilities
                  </CardDescription>
                </div>
                <Dialog open={isHostelDialogOpen} onOpenChange={setIsHostelDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Hostel
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedHostel ? 'Edit Hostel' : 'Add New Hostel'}
                      </DialogTitle>
                      <DialogDescription>
                        Enter the hostel details below
                      </DialogDescription>
                    </DialogHeader>
                    <HostelDialog
                      hostel={selectedHostel || undefined}
                      onSave={handleHostelSave}
                      onClose={() => setIsHostelDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search hostels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="boys">Boys</SelectItem>
                    <SelectItem value="girls">Girls</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHostels.map((hostel) => (
                  <Card key={hostel.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{hostel.name}</CardTitle>
                        <Badge className={getStatusBadgeColor(hostel.status)}>
                          {hostel.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        <Badge variant="outline" className="mr-2">
                          {hostel.type}
                        </Badge>
                        {hostel.occupied}/{hostel.capacity} occupied
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{hostel.warden}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{hostel.contact}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{hostel.address}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {hostel.facilities.slice(0, 3).map((facility) => (
                            <Badge key={facility} variant="secondary" className="text-xs">
                              {facility}
                            </Badge>
                          ))}
                          {hostel.facilities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{hostel.facilities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedHostel(hostel)
                            setIsHostelDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleHostelDelete(hostel.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rooms</CardTitle>
                  <CardDescription>
                    Manage room allocation and availability
                  </CardDescription>
                </div>
                <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Room
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedRoom ? 'Edit Room' : 'Add New Room'}
                      </DialogTitle>
                      <DialogDescription>
                        Enter the room details below
                      </DialogDescription>
                    </DialogHeader>
                    <RoomDialog
                      room={selectedRoom || undefined}
                      onSave={handleRoomSave}
                      onClose={() => setIsRoomDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="partially_occupied">Partially Occupied</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room</TableHead>
                      <TableHead>Hostel</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Occupied</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>
                          <div className="font-medium">{room.roomNumber}</div>
                        </TableCell>
                        <TableCell>{room.hostelName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{room.type}</Badge>
                        </TableCell>
                        <TableCell>{room.floor}</TableCell>
                        <TableCell>{room.capacity}</TableCell>
                        <TableCell>{room.occupied}</TableCell>
                        <TableCell>${room.rent}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(room.status)}>
                            {room.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRoom(room)
                                setIsRoomDialogOpen(true)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRoomDelete(room.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Residents</CardTitle>
                  <CardDescription>
                    Manage student check-ins and hostel assignments
                  </CardDescription>
                </div>
                <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Check In Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedStudent ? 'Edit Student' : 'Check In Student'}
                      </DialogTitle>
                      <DialogDescription>
                        Enter the student details below
                      </DialogDescription>
                    </DialogHeader>
                    <StudentDialog
                      student={selectedStudent || undefined}
                      onSave={handleStudentSave}
                      onClose={() => setIsStudentDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Hostel</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Check-in Date</TableHead>
                      <TableHead>Monthly Rent</TableHead>
                      <TableHead>Fee Status</TableHead>
                      <TableHead>Emergency Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.studentId}</div>
                            <div className="text-sm text-gray-600">{student.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{student.hostelName}</TableCell>
                        <TableCell>{student.roomNumber}</TableCell>
                        <TableCell>{student.checkInDate}</TableCell>
                        <TableCell>${student.monthlyRent}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(student.feeStatus)}>
                            {student.feeStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{student.emergencyContact.name}</div>
                            <div className="text-gray-600">{student.emergencyContact.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedStudent(student)
                                setIsStudentDialogOpen(true)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStudentCheckout(student.id)}
                            >
                              <Key className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance & Facilities</CardTitle>
              <CardDescription>
                Track maintenance requests and facility management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Home className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Maintenance Management</h3>
                <p className="text-gray-600">
                  This feature will track maintenance requests, facility repairs, and hostel upkeep.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
