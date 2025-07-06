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
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  Users, 
  Settings, 
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
  User,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface AuditLog {
  id: number
  userId: string
  action: string
  resource: string
  ipAddress: string
  userAgent: string
  timestamp: string
  status: string
  details: string
}

interface Permission {
  id: number
  roleId: string
  roleName: string
  permissions: string[]
}

const availablePermissions = [
  'dashboard.view',
  'students.view',
  'students.create',
  'students.edit',
  'students.delete',
  'teachers.view',
  'teachers.create',
  'teachers.edit',
  'teachers.delete',
  'academics.view',
  'academics.manage',
  'fees.view',
  'fees.manage',
  'operations.view',
  'operations.manage',
  'reports.view',
  'reports.generate',
  'admin.view',
  'admin.manage',
  'security.view',
  'security.manage'
]

export default function SecurityPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  useEffect(() => {
    fetchAuditLogs()
    fetchPermissions()
  }, [])

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/security/audit-logs')
      const data = await response.json()
      setAuditLogs(data.auditLogs || [])
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/security/permissions')
      const data = await response.json()
      setPermissions(data.permissions || [])
    } catch (error) {
      console.error('Error fetching permissions:', error)
    }
  }

  const handlePermissionSave = async () => {
    try {
      const method = selectedPermission ? 'PUT' : 'POST'
      const url = '/api/security/permissions'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedPermission?.id,
          roleId: selectedRole,
          roleName: selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1),
          permissions: selectedPermissions
        }),
      })

      if (response.ok) {
        fetchPermissions()
        setIsPermissionDialogOpen(false)
        setSelectedPermission(null)
        setSelectedRole('')
        setSelectedPermissions([])
      }
    } catch (error) {
      console.error('Error saving permissions:', error)
    }
  }

  const handlePermissionEdit = (permission: Permission) => {
    setSelectedPermission(permission)
    setSelectedRole(permission.roleId)
    setSelectedPermissions(permission.permissions)
    setIsPermissionDialogOpen(true)
  }

  const handlePermissionDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/security/permissions?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPermissions()
      }
    } catch (error) {
      console.error('Error deleting permission:', error)
    }
  }

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = !actionFilter || log.action === actionFilter
    const matchesStatus = !statusFilter || log.status === statusFilter
    
    return matchesSearch && matchesAction && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return <User className="w-4 h-4" />
      case 'LOGOUT':
        return <User className="w-4 h-4" />
      case 'CREATE':
        return <Plus className="w-4 h-4" />
      case 'UPDATE':
        return <Edit className="w-4 h-4" />
      case 'DELETE':
        return <Trash2 className="w-4 h-4" />
      case 'ACCESS_DENIED':
        return <Lock className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Security & Compliance</h1>
          <p className="text-gray-600 mt-2">Manage system security, audit logs, and user permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Security Settings
          </Button>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87%</div>
            <p className="text-xs text-gray-600">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-600">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Eye className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-gray-600">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
            <Users className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
            <p className="text-xs text-gray-600">Permission groups</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit-logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="security-settings">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="audit-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                Track all system activities and user actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Actions</SelectItem>
                    <SelectItem value="LOGIN">Login</SelectItem>
                    <SelectItem value="LOGOUT">Logout</SelectItem>
                    <SelectItem value="CREATE">Create</SelectItem>
                    <SelectItem value="UPDATE">Update</SelectItem>
                    <SelectItem value="DELETE">Delete</SelectItem>
                    <SelectItem value="ACCESS_DENIED">Access Denied</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="WARNING">Warning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAuditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getActionIcon(log.action)}
                            <span className="font-medium">{log.action}</span>
                          </div>
                        </TableCell>
                        <TableCell>{log.userId}</TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(log.status)}>
                            {log.status === 'SUCCESS' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(log.timestamp).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">{log.details}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Role Permissions</CardTitle>
                  <CardDescription>
                    Manage user roles and their permissions
                  </CardDescription>
                </div>
                <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedPermission ? 'Edit Role Permissions' : 'Add New Role'}
                      </DialogTitle>
                      <DialogDescription>
                        Configure permissions for this role
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="accountant">Accountant</SelectItem>
                            <SelectItem value="librarian">Librarian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2 max-h-64 overflow-y-auto">
                          {availablePermissions.map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission}
                                checked={selectedPermissions.includes(permission)}
                                onCheckedChange={(checked: boolean) => {
                                  if (checked) {
                                    setSelectedPermissions([...selectedPermissions, permission])
                                  } else {
                                    setSelectedPermissions(selectedPermissions.filter(p => p !== permission))
                                  }
                                }}
                              />
                              <Label htmlFor={permission} className="text-sm">
                                {permission}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handlePermissionSave}>
                          {selectedPermission ? 'Update' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{permission.roleName}</h3>
                        <p className="text-sm text-gray-600">
                          {permission.permissions.length} permissions assigned
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePermissionEdit(permission)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePermissionDelete(permission.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {permission.permissions.map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security-settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
                <CardDescription>
                  Configure password requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Minimum Length</Label>
                  <Input type="number" value="8" className="w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Uppercase</Label>
                  <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Lowercase</Label>
                  <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Numbers</Label>
                  <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Special Characters</Label>
                  <Checkbox defaultChecked />
                </div>
                <Button className="w-full">Save Password Policy</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
                <CardDescription>
                  Configure session timeout and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Session Timeout (minutes)</Label>
                  <Input type="number" value="30" className="w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Max Concurrent Sessions</Label>
                  <Input type="number" value="3" className="w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Force Logout on IP Change</Label>
                  <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Remember Me Option</Label>
                  <Checkbox defaultChecked />
                </div>
                <Button className="w-full">Save Session Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Configure 2FA settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable 2FA</Label>
                  <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Mandatory for Admins</Label>
                  <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>SMS Verification</Label>
                  <Checkbox />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Email Verification</Label>
                  <Checkbox defaultChecked />
                </div>
                <Button className="w-full">Save 2FA Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Encryption</CardTitle>
                <CardDescription>
                  Configure data protection settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Encrypt Database</Label>
                  <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Encrypt File Storage</Label>
                  <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Encrypt Backups</Label>
                  <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>SSL/TLS Encryption</Label>
                  <Checkbox defaultChecked />
                </div>
                <Button className="w-full">Save Encryption Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
