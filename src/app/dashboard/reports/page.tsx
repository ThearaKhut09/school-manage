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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  BarChart3,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  FileText,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Calendar,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Share,
  Settings,
  Zap,
  Database,
  LineChart,
} from 'lucide-react'

// Mock data for reports
const mockReports = [
  {
    id: '1',
    name: 'Student Performance Report',
    description: 'Comprehensive analysis of student academic performance across all subjects',
    category: 'Academic',
    type: 'Standard',
    frequency: 'Monthly',
    lastGenerated: '2024-01-15',
    status: 'Active',
    format: 'PDF',
    recipients: ['teachers', 'parents'],
    parameters: {
      dateRange: 'Last Month',
      classes: 'All',
      subjects: 'All',
    },
  },
  {
    id: '2',
    name: 'Attendance Analytics',
    description: 'Detailed attendance patterns and trends for all students',
    category: 'Attendance',
    type: 'Analytics',
    frequency: 'Weekly',
    lastGenerated: '2024-01-20',
    status: 'Active',
    format: 'Excel',
    recipients: ['admin', 'teachers'],
    parameters: {
      dateRange: 'Last Week',
      classes: 'All',
      threshold: '85%',
    },
  },
  {
    id: '3',
    name: 'Financial Summary',
    description: 'Fee collection status and financial overview',
    category: 'Financial',
    type: 'Dashboard',
    frequency: 'Daily',
    lastGenerated: '2024-01-25',
    status: 'Active',
    format: 'Dashboard',
    recipients: ['admin', 'accounts'],
    parameters: {
      dateRange: 'Current Month',
      feeTypes: 'All',
      status: 'All',
    },
  },
  {
    id: '4',
    name: 'Teacher Workload Analysis',
    description: 'Analysis of teacher assignments, classes, and workload distribution',
    category: 'Staff',
    type: 'Custom',
    frequency: 'Quarterly',
    lastGenerated: '2024-01-10',
    status: 'Draft',
    format: 'PDF',
    recipients: ['admin', 'hr'],
    parameters: {
      dateRange: 'Current Quarter',
      departments: 'All',
      metrics: 'All',
    },
  },
  {
    id: '5',
    name: 'Parent Engagement Report',
    description: 'Parent portal usage and engagement metrics',
    category: 'Communication',
    type: 'Analytics',
    frequency: 'Monthly',
    lastGenerated: '2024-01-18',
    status: 'Active',
    format: 'Dashboard',
    recipients: ['admin', 'teachers'],
    parameters: {
      dateRange: 'Last Month',
      engagement: 'All',
      classes: 'All',
    },
  },
]

// Mock analytics data
const mockAnalytics = {
  studentPerformance: {
    averageGrade: 78.5,
    trend: 'up',
    topPerformers: 15,
    needsAttention: 8,
  },
  attendance: {
    overallRate: 92.3,
    trend: 'up',
    presentToday: 485,
    absentToday: 15,
  },
  financial: {
    collectionRate: 87.2,
    trend: 'down',
    totalDue: 125000,
    collected: 109000,
  },
  enrollment: {
    totalStudents: 500,
    trend: 'up',
    newAdmissions: 25,
    transfers: 3,
  },
}

export default function ReportsPage() {
  const [reports] = useState(mockReports)
  const [analytics] = useState(mockAnalytics)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [viewMode, setViewMode] = useState<'reports' | 'analytics' | 'dashboard'>('dashboard')

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || report.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesType = selectedType === 'all' || report.type.toLowerCase() === selectedType.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic':
        return 'bg-blue-100 text-blue-800'
      case 'attendance':
        return 'bg-green-100 text-green-800'
      case 'financial':
        return 'bg-purple-100 text-purple-800'
      case 'staff':
        return 'bg-orange-100 text-orange-800'
      case 'communication':
        return 'bg-cyan-100 text-cyan-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    )
  }

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate insights and reports from your school data</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button size="sm" onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Mode
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'dashboard' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('dashboard')}
              >
                <PieChart className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={viewMode === 'analytics' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('analytics')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button
                variant={viewMode === 'reports' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('reports')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Reports
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Dashboard View */}
      {viewMode === 'dashboard' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Student Performance</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-gray-900">{analytics.studentPerformance.averageGrade}%</p>
                      {getTrendIcon(analytics.studentPerformance.trend)}
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-gray-900">{analytics.attendance.overallRate}%</p>
                      {getTrendIcon(analytics.attendance.trend)}
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fee Collection</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-gray-900">{analytics.financial.collectionRate}%</p>
                      {getTrendIcon(analytics.financial.trend)}
                    </div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-gray-900">{analytics.enrollment.totalStudents}</p>
                      {getTrendIcon(analytics.enrollment.trend)}
                    </div>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <GraduationCap className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Top Performers</span>
                    <Badge className="bg-green-100 text-green-800">
                      {analytics.studentPerformance.topPerformers} students
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Need Attention</span>
                    <Badge className="bg-red-100 text-red-800">
                      {analytics.studentPerformance.needsAttention} students
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Today's Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Present</span>
                    <Badge className="bg-green-100 text-green-800">
                      {analytics.attendance.presentToday}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Absent</span>
                    <Badge className="bg-red-100 text-red-800">
                      {analytics.attendance.absentToday}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Attendance
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Financial Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Collected</span>
                    <Badge className="bg-green-100 text-green-800">
                      ${analytics.financial.collected.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      ${(analytics.financial.totalDue - analytics.financial.collected).toLocaleString()}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="w-5 h-5 mr-2" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart visualization would go here</p>
                  <p className="text-sm text-gray-400">Performance trends over time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Attendance Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Pie chart visualization would go here</p>
                  <p className="text-sm text-gray-400">Attendance rate distribution</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Fee Collection Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Line chart visualization would go here</p>
                  <p className="text-sm text-gray-400">Fee collection over time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Enrollment Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Bar chart visualization would go here</p>
                  <p className="text-sm text-gray-400">Student enrollment by grade</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reports View */}
      {viewMode === 'reports' && (
        <>
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
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="attendance">Attendance</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Available Reports ({filteredReports.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.map(report => (
                  <div key={report.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{report.name}</h3>
                          <Badge className={getCategoryColor(report.category)}>
                            {report.category}
                          </Badge>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <Badge variant="outline">
                            {report.format}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {report.frequency}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Last: {report.lastGenerated}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {report.recipients.length} recipients
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedReport(report)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Report Details Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Configuration and settings for {selectedReport?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedReport.name}</h3>
                  <p className="text-gray-600">{selectedReport.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(selectedReport.category)}>
                    {selectedReport.category}
                  </Badge>
                  <Badge className={getStatusColor(selectedReport.status)}>
                    {selectedReport.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Report Configuration</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Type:</strong> {selectedReport.type}</p>
                    <p><strong>Frequency:</strong> {selectedReport.frequency}</p>
                    <p><strong>Format:</strong> {selectedReport.format}</p>
                    <p><strong>Last Generated:</strong> {selectedReport.lastGenerated}</p>
                    <p><strong>Status:</strong> {selectedReport.status}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Parameters</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(selectedReport.parameters).map(([key, value]) => (
                      <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Recipients</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedReport.recipients.map(recipient => (
                    <Badge key={recipient} variant="outline">
                      {recipient.charAt(0).toUpperCase() + recipient.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Report Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reportName">Report Name</Label>
                <Input id="reportName" placeholder="Enter report name" />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="attendance">Attendance</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter report description" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
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
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="format">Format</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="recipients">Recipients</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teachers">Teachers</SelectItem>
                  <SelectItem value="parents">Parents</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="accounts">Accounts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateDialog(false)}>
                Create Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
