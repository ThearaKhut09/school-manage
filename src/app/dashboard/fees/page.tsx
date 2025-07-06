'use client'

import { useState } from 'react'
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
  DollarSign,
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
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  TrendingUp,
  CreditCard,
  Receipt,
  Banknote,
  Wallet,
  FileText,
  Mail,
  Phone,
} from 'lucide-react'

// Mock data for fee records
const mockFeeRecords = [
  {
    id: '1',
    studentName: 'Emma Johnson',
    studentId: 'STU001',
    rollNumber: '2024001',
    class: 'Grade 10-A',
    feeType: 'Tuition Fee',
    amount: 5000,
    dueDate: '2024-01-31',
    paidDate: '2024-01-25',
    status: 'Paid',
    paymentMethod: 'Online',
    transactionId: 'TXN001',
    term: 'Q1 2024',
    discount: 0,
    penalty: 0,
    finalAmount: 5000,
    receiptNo: 'RCP001',
    parentName: 'Robert Johnson',
    parentPhone: '+1 (555) 123-4567',
    parentEmail: 'robert.johnson@email.com',
  },
  {
    id: '2',
    studentName: 'Michael Chen',
    studentId: 'STU002',
    rollNumber: '2024002',
    class: 'Grade 10-B',
    feeType: 'Tuition Fee',
    amount: 5000,
    dueDate: '2024-01-31',
    paidDate: null,
    status: 'Pending',
    paymentMethod: null,
    transactionId: null,
    term: 'Q1 2024',
    discount: 500,
    penalty: 0,
    finalAmount: 4500,
    receiptNo: null,
    parentName: 'Linda Chen',
    parentPhone: '+1 (555) 234-5678',
    parentEmail: 'linda.chen@email.com',
  },
  {
    id: '3',
    studentName: 'Sarah Williams',
    studentId: 'STU003',
    rollNumber: '2024003',
    class: 'Grade 9-A',
    feeType: 'Transport Fee',
    amount: 800,
    dueDate: '2024-01-15',
    paidDate: null,
    status: 'Overdue',
    paymentMethod: null,
    transactionId: null,
    term: 'Q1 2024',
    discount: 0,
    penalty: 80,
    finalAmount: 880,
    receiptNo: null,
    parentName: 'David Williams',
    parentPhone: '+1 (555) 345-6789',
    parentEmail: 'david.williams@email.com',
  },
  {
    id: '4',
    studentName: 'James Rodriguez',
    studentId: 'STU004',
    rollNumber: '2024004',
    class: 'Grade 11-A',
    feeType: 'Lab Fee',
    amount: 1200,
    dueDate: '2024-02-15',
    paidDate: '2024-02-10',
    status: 'Paid',
    paymentMethod: 'Cash',
    transactionId: 'TXN002',
    term: 'Q1 2024',
    discount: 100,
    penalty: 0,
    finalAmount: 1100,
    receiptNo: 'RCP002',
    parentName: 'Maria Rodriguez',
    parentPhone: '+1 (555) 456-7890',
    parentEmail: 'maria.rodriguez@email.com',
  },
  {
    id: '5',
    studentName: 'Emily Davis',
    studentId: 'STU005',
    rollNumber: '2024005',
    class: 'Grade 12-A',
    feeType: 'Library Fee',
    amount: 300,
    dueDate: '2024-02-28',
    paidDate: null,
    status: 'Partial',
    paymentMethod: 'Online',
    transactionId: 'TXN003',
    term: 'Q1 2024',
    discount: 0,
    penalty: 0,
    finalAmount: 300,
    receiptNo: null,
    parentName: 'Michael Davis',
    parentPhone: '+1 (555) 567-8901',
    parentEmail: 'michael.davis@email.com',
  },
]

// Mock fee structure
const mockFeeStructure = [
  {
    id: '1',
    feeType: 'Tuition Fee',
    class: 'Grade 10',
    amount: 5000,
    frequency: 'Quarterly',
    mandatory: true,
    description: 'Regular tuition fees for academic instruction',
  },
  {
    id: '2',
    feeType: 'Transport Fee',
    class: 'All',
    amount: 800,
    frequency: 'Monthly',
    mandatory: false,
    description: 'School bus transportation service',
  },
  {
    id: '3',
    feeType: 'Lab Fee',
    class: 'Grade 11-12',
    amount: 1200,
    frequency: 'Quarterly',
    mandatory: true,
    description: 'Laboratory equipment and materials',
  },
  {
    id: '4',
    feeType: 'Library Fee',
    class: 'All',
    amount: 300,
    frequency: 'Annual',
    mandatory: true,
    description: 'Library maintenance and book purchases',
  },
  {
    id: '5',
    feeType: 'Sports Fee',
    class: 'All',
    amount: 600,
    frequency: 'Annual',
    mandatory: false,
    description: 'Sports equipment and facility maintenance',
  },
]

export default function FeesPage() {
  const [feeRecords] = useState(mockFeeRecords)
  const [feeStructure] = useState(mockFeeStructure)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedFeeType, setSelectedFeeType] = useState('all')
  const [selectedRecord, setSelectedRecord] = useState<typeof mockFeeRecords[0] | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showStructureDialog, setShowStructureDialog] = useState(false)
  const [viewMode, setViewMode] = useState<'records' | 'structure'>('records')

  const filteredRecords = feeRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesClass = selectedClass === 'all' || record.class === selectedClass
    const matchesStatus = selectedStatus === 'all' || record.status.toLowerCase() === selectedStatus.toLowerCase()
    const matchesFeeType = selectedFeeType === 'all' || record.feeType === selectedFeeType
    
    return matchesSearch && matchesClass && matchesStatus && matchesFeeType
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'partial':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'overdue':
        return <XCircle className="w-4 h-4" />
      case 'partial':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getPaymentMethodIcon = (method: string | null) => {
    if (!method) return null
    
    switch (method.toLowerCase()) {
      case 'online':
        return <CreditCard className="w-4 h-4" />
      case 'cash':
        return <Banknote className="w-4 h-4" />
      case 'cheque':
        return <Receipt className="w-4 h-4" />
      default:
        return <Wallet className="w-4 h-4" />
    }
  }

  const calculateStats = () => {
    const totalAmount = feeRecords.reduce((acc, record) => acc + record.finalAmount, 0)
    const paidAmount = feeRecords.filter(r => r.status === 'Paid').reduce((acc, record) => acc + record.finalAmount, 0)
    const pendingAmount = feeRecords.filter(r => r.status === 'Pending').reduce((acc, record) => acc + record.finalAmount, 0)
    const overdueAmount = feeRecords.filter(r => r.status === 'Overdue').reduce((acc, record) => acc + record.finalAmount, 0)
    const collectionRate = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0

    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      collectionRate,
    }
  }

  const stats = calculateStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-600">Manage student fees, payments, and financial records</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Records
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Payment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">${stats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collected</p>
                <p className="text-xl font-bold text-green-600">${stats.paidAmount.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl font-bold text-yellow-600">${stats.pendingAmount.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-xl font-bold text-red-600">${stats.overdueAmount.toLocaleString()}</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                <p className="text-xl font-bold text-purple-600">{stats.collectionRate}%</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters & View
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'records' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('records')}
              >
                Payment Records
              </Button>
              <Button
                variant={viewMode === 'structure' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('structure')}
              >
                Fee Structure
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'records' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                  <SelectItem value="Grade 10-A">Grade 10-A</SelectItem>
                  <SelectItem value="Grade 10-B">Grade 10-B</SelectItem>
                  <SelectItem value="Grade 11-A">Grade 11-A</SelectItem>
                  <SelectItem value="Grade 12-A">Grade 12-A</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedFeeType} onValueChange={setSelectedFeeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fee Types</SelectItem>
                  <SelectItem value="Tuition Fee">Tuition Fee</SelectItem>
                  <SelectItem value="Transport Fee">Transport Fee</SelectItem>
                  <SelectItem value="Lab Fee">Lab Fee</SelectItem>
                  <SelectItem value="Library Fee">Library Fee</SelectItem>
                  <SelectItem value="Sports Fee">Sports Fee</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Advanced
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Records View */}
      {viewMode === 'records' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Payment Records ({filteredRecords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRecords.map(record => (
                <div key={record.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{record.studentName}</h3>
                        <Badge variant="outline">{record.studentId}</Badge>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1">{record.status}</span>
                        </Badge>
                        {record.paymentMethod && (
                          <Badge variant="outline">
                            {getPaymentMethodIcon(record.paymentMethod)}
                            <span className="ml-1">{record.paymentMethod}</span>
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {record.class}
                        </span>
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {record.feeType}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Due: {record.dueDate}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${record.finalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-sm font-medium">Amount</div>
                        <div className="text-sm text-gray-600">${record.amount.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Final Amount</div>
                        <div className="text-sm text-gray-600">${record.finalAmount.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Status</div>
                        <div className="text-sm text-gray-600">{record.status}</div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedRecord(record)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Receipt className="mr-2 h-4 w-4" />
                            Generate Receipt
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Reminder
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Record
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
      )}

      {/* Fee Structure View */}
      {viewMode === 'structure' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Fee Structure ({feeStructure.length})
              </CardTitle>
              <Button size="sm" onClick={() => setShowStructureDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Fee Type
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feeStructure.map(fee => (
                <div key={fee.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{fee.feeType}</h3>
                        <Badge variant={fee.mandatory ? 'default' : 'outline'}>
                          {fee.mandatory ? 'Mandatory' : 'Optional'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{fee.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {fee.class}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {fee.frequency}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${fee.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">${fee.amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{fee.frequency}</div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Fee Type
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            Apply to Students
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Fee Type
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
      )}

      {/* Payment Details Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Detailed payment information for {selectedRecord?.studentName}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedRecord.studentName}</h3>
                  <p className="text-gray-600">{selectedRecord.studentId} • {selectedRecord.class}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(selectedRecord.status)}>
                    {getStatusIcon(selectedRecord.status)}
                    <span className="ml-1">{selectedRecord.status}</span>
                  </Badge>
                  {selectedRecord.receiptNo && (
                    <Badge variant="outline">
                      <Receipt className="w-3 h-3 mr-1" />
                      {selectedRecord.receiptNo}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Fee Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Fee Type:</strong> {selectedRecord.feeType}</p>
                    <p><strong>Term:</strong> {selectedRecord.term}</p>
                    <p><strong>Original Amount:</strong> ${selectedRecord.amount.toLocaleString()}</p>
                    <p><strong>Discount:</strong> ${selectedRecord.discount.toLocaleString()}</p>
                    <p><strong>Penalty:</strong> ${selectedRecord.penalty.toLocaleString()}</p>
                    <p><strong>Final Amount:</strong> ${selectedRecord.finalAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Payment Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Due Date:</strong> {selectedRecord.dueDate}</p>
                    <p><strong>Paid Date:</strong> {selectedRecord.paidDate || 'Not paid'}</p>
                    <p><strong>Payment Method:</strong> {selectedRecord.paymentMethod || 'N/A'}</p>
                    <p><strong>Transaction ID:</strong> {selectedRecord.transactionId || 'N/A'}</p>
                    <p><strong>Status:</strong> {selectedRecord.status}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Parent/Guardian Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{selectedRecord.parentName}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{selectedRecord.parentPhone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{selectedRecord.parentEmail}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">${selectedRecord.amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Original Amount</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">${selectedRecord.discount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Discount</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">${selectedRecord.penalty.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Penalty</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">${selectedRecord.finalAmount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Final Amount</div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                  Close
                </Button>
                <Button>
                  <Receipt className="w-4 h-4 mr-2" />
                  Generate Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Payment Record</DialogTitle>
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
                <Label htmlFor="feeType">Fee Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tuition">Tuition Fee</SelectItem>
                    <SelectItem value="transport">Transport Fee</SelectItem>
                    <SelectItem value="lab">Lab Fee</SelectItem>
                    <SelectItem value="library">Library Fee</SelectItem>
                    <SelectItem value="sports">Sports Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" placeholder="Enter amount" />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount">Discount</Label>
                <Input id="discount" type="number" placeholder="Enter discount" defaultValue="0" />
              </div>
              <div>
                <Label htmlFor="penalty">Penalty</Label>
                <Input id="penalty" type="number" placeholder="Enter penalty" defaultValue="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input id="transactionId" placeholder="Enter transaction ID" />
              </div>
            </div>
            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" placeholder="Any additional notes..." />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddDialog(false)}>
                Add Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Fee Structure Dialog */}
      <Dialog open={showStructureDialog} onOpenChange={setShowStructureDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Fee Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="feeTypeName">Fee Type Name</Label>
                <Input id="feeTypeName" placeholder="e.g., Tuition Fee" />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" placeholder="Enter amount" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicableClass">Applicable Class</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="grade-9">Grade 9</SelectItem>
                    <SelectItem value="grade-10">Grade 10</SelectItem>
                    <SelectItem value="grade-11">Grade 11</SelectItem>
                    <SelectItem value="grade-12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="mandatory">Fee Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mandatory">Mandatory</SelectItem>
                  <SelectItem value="optional">Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter description of this fee type" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowStructureDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowStructureDialog(false)}>
                Add Fee Type
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
