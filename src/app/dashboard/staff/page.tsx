'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
  DialogTrigger,
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
  Building,
  DollarSign,
  UserCheck,
  UserX,
  Award,
  Clock,
  FileText,
  TrendingUp,
  BarChart3,
} from 'lucide-react'

interface Staff {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  position: string
  department: string | null
  salary: number | null
  dateOfJoining: string
  address: string
  isActive: boolean
  school: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

// Mock data for demonstration
const mockStaffData: Staff[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'John Smith',
    email: 'john.smith@school.com',
    phone: '+1234567890',
    position: 'Principal',
    department: 'Administration',
    salary: 75000,
    dateOfJoining: '2020-01-15',
    address: '123 Main St, City, State 12345',
    isActive: true,
    school: {
      id: '1',
      name: 'Springfield High School'
    },
    createdAt: '2020-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@school.com',
    phone: '+1234567891',
    position: 'Vice Principal',
    department: 'Administration',
    salary: 65000,
    dateOfJoining: '2020-03-20',
    address: '456 Oak Ave, City, State 12345',
    isActive: true,
    school: {
      id: '1',
      name: 'Springfield High School'
    },
    createdAt: '2020-03-20T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Michael Brown',
    email: 'michael.brown@school.com',
    phone: '+1234567892',
    position: 'Librarian',
    department: 'Library',
    salary: 45000,
    dateOfJoining: '2021-08-10',
    address: '789 Pine St, City, State 12345',
    isActive: true,
    school: {
      id: '1',
      name: 'Springfield High School'
    },
    createdAt: '2021-08-10T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: '4',
    employeeId: 'EMP004',
    name: 'Emily Davis',
    email: 'emily.davis@school.com',
    phone: '+1234567893',
    position: 'IT Administrator',
    department: 'IT',
    salary: 55000,
    dateOfJoining: '2022-01-05',
    address: '321 Elm St, City, State 12345',
    isActive: true,
    school: {
      id: '1',
      name: 'Springfield High School'
    },
    createdAt: '2022-01-05T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: '5',
    employeeId: 'EMP005',
    name: 'David Wilson',
    email: 'david.wilson@school.com',
    phone: '+1234567894',
    position: 'Maintenance Manager',
    department: 'Maintenance',
    salary: 40000,
    dateOfJoining: '2019-06-15',
    address: '654 Maple Ave, City, State 12345',
    isActive: false,
    school: {
      id: '1',
      name: 'Springfield High School'
    },
    createdAt: '2019-06-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
]

const departments = [
  'Administration',
  'Library',
  'IT',
  'Maintenance',
  'Security',
  'Transport',
  'Accounts',
  'Reception',
  'Counseling',
  'Medical',
]

export default function StaffPage() {
  const [staffData, setStaffData] = useState<Staff[]>(mockStaffData)
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>(mockStaffData)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Filter staff based on search term, department, and status
  useEffect(() => {
    let filtered = staffData

    if (searchTerm) {
      filtered = filtered.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedDepartment) {
      filtered = filtered.filter(staff => staff.department === selectedDepartment)
    }

    if (selectedStatus) {
      filtered = filtered.filter(staff => 
        selectedStatus === 'active' ? staff.isActive : !staff.isActive
      )
    }

    setFilteredStaff(filtered)
  }, [searchTerm, selectedDepartment, selectedStatus, staffData])

  const handleAddStaff = () => {
    setSelectedStaff(null)
    setShowAddDialog(true)
  }

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff)
    setShowEditDialog(true)
  }

  const handleViewDetails = (staff: Staff) => {
    setSelectedStaff(staff)
    setShowDetailsDialog(true)
  }

  const handleDeleteStaff = (staffId: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaffData(prev => prev.filter(staff => staff.id !== staffId))
    }
  }

  const handleToggleStatus = (staffId: string) => {
    setStaffData(prev => prev.map(staff => 
      staff.id === staffId ? { ...staff, isActive: !staff.isActive } : staff
    ))
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const formatSalary = (salary: number | null) => {
    return salary ? `$${salary.toLocaleString()}` : 'Not specified'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateYearsOfService = (dateOfJoining: string) => {
    const joinDate = new Date(dateOfJoining)
    const now = new Date()
    const years = now.getFullYear() - joinDate.getFullYear()
    const months = now.getMonth() - joinDate.getMonth()
    const totalMonths = years * 12 + months
    return totalMonths < 12 ? `${totalMonths} months` : `${years} years`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage school staff, HR records, and payroll</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Staff
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Payroll Report
          </Button>
          <Button size="sm" onClick={handleAddStaff}>
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{staffData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-gray-900">
                  {staffData.filter(staff => staff.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(staffData.map(staff => staff.department).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Salary</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${Math.round(staffData.filter(staff => staff.salary).reduce((sum, staff) => sum + (staff.salary || 0), 0) / staffData.filter(staff => staff.salary).length).toLocaleString()}
                </p>
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
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
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

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-sm text-gray-500">{staff.employeeId}</div>
                      <div className="text-sm text-gray-500">{staff.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{staff.position}</TableCell>
                  <TableCell>{staff.department || 'Not specified'}</TableCell>
                  <TableCell>{formatSalary(staff.salary)}</TableCell>
                  <TableCell>{calculateYearsOfService(staff.dateOfJoining)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(staff.isActive)}>
                      {staff.isActive ? 'Active' : 'Inactive'}
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
                        <DropdownMenuItem onClick={() => handleViewDetails(staff)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditStaff(staff)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(staff.id)}>
                          {staff.isActive ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteStaff(staff.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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

      {/* Add Staff Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>
              Enter the details of the new staff member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" placeholder="EMP001" />
              </div>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Smith" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.smith@school.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1234567890" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Input id="position" placeholder="Administrator" />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary">Salary (Optional)</Label>
                <Input id="salary" type="number" placeholder="50000" />
              </div>
              <div>
                <Label htmlFor="dateOfJoining">Date of Joining</Label>
                <Input id="dateOfJoining" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Full address" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle add logic here
                setShowAddDialog(false)
              }}>
                Add Staff Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update the staff member's information.
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-employeeId">Employee ID</Label>
                  <Input 
                    id="edit-employeeId" 
                    defaultValue={selectedStaff.employeeId}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input 
                    id="edit-name" 
                    defaultValue={selectedStaff.name}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input 
                    id="edit-email" 
                    type="email" 
                    defaultValue={selectedStaff.email}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input 
                    id="edit-phone" 
                    defaultValue={selectedStaff.phone}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-position">Position</Label>
                  <Input 
                    id="edit-position" 
                    defaultValue={selectedStaff.position}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Select defaultValue={selectedStaff.department || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-salary">Salary</Label>
                  <Input 
                    id="edit-salary" 
                    type="number" 
                    defaultValue={selectedStaff.salary || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedStaff.isActive ? 'active' : 'inactive'}>
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
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Textarea 
                  id="edit-address" 
                  defaultValue={selectedStaff.address}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Handle update logic here
                  setShowEditDialog(false)
                }}>
                  Update Staff Member
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Staff Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Staff Member Details</DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Name:</span>
                      <span className="ml-2">{selectedStaff.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Employee ID:</span>
                      <span className="ml-2">{selectedStaff.employeeId}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{selectedStaff.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{selectedStaff.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Position:</span>
                      <span className="ml-2">{selectedStaff.position}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Department:</span>
                      <span className="ml-2">{selectedStaff.department || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Salary:</span>
                      <span className="ml-2">{formatSalary(selectedStaff.salary)}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Date of Joining:</span>
                      <span className="ml-2">{formatDate(selectedStaff.dateOfJoining)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Address:</span>
                    <span className="ml-2">{selectedStaff.address}</span>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Employment Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-medium">Service Duration</div>
                    <div className="text-sm text-gray-600">
                      {calculateYearsOfService(selectedStaff.dateOfJoining)}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Badge className={`w-8 h-8 ${selectedStaff.isActive ? 'text-green-600' : 'text-red-600'} mx-auto mb-2`} />
                    <div className="font-medium">Status</div>
                    <div className="text-sm text-gray-600">
                      {selectedStaff.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Building className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="font-medium">School</div>
                    <div className="text-sm text-gray-600">
                      {selectedStaff.school.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowDetailsDialog(false)
                  handleEditStaff(selectedStaff)
                }}>
                  Edit Staff
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
