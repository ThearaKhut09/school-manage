'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Bus,
  Package,
  Wrench,
  Settings,
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Truck,
  Users,
  Building,
  Shield,
  Activity,
  BarChart3,
  FileText,
  Clipboard,
  Tool,
} from 'lucide-react'

interface Bus {
  id: string
  busNumber: string
  driverName: string
  driverPhone: string
  route: string
  capacity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface InventoryItem {
  id: string
  name: string
  description: string | null
  category: string
  quantity: number
  unitPrice: number | null
  supplier: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Mock data
const mockBuses: Bus[] = [
  {
    id: '1',
    busNumber: 'BUS001',
    driverName: 'John Driver',
    driverPhone: '+1234567890',
    route: 'Downtown - School',
    capacity: 50,
    isActive: true,
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    busNumber: 'BUS002',
    driverName: 'Mike Wilson',
    driverPhone: '+1234567891',
    route: 'Suburbs - School',
    capacity: 45,
    isActive: true,
    createdAt: '2023-02-20T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '3',
    busNumber: 'BUS003',
    driverName: 'Sarah Johnson',
    driverPhone: '+1234567892',
    route: 'Industrial Area - School',
    capacity: 40,
    isActive: false,
    createdAt: '2023-03-10T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
]

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Whiteboard Markers',
    description: 'Black whiteboard markers - pack of 12',
    category: 'Stationery',
    quantity: 25,
    unitPrice: 15.99,
    supplier: 'Office Supplies Co.',
    isActive: true,
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Projector Bulbs',
    description: 'Replacement bulbs for classroom projectors',
    category: 'Electronics',
    quantity: 8,
    unitPrice: 89.99,
    supplier: 'Tech Solutions Ltd.',
    isActive: true,
    createdAt: '2023-02-20T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Cleaning Supplies',
    description: 'Floor cleaner and disinfectant',
    category: 'Maintenance',
    quantity: 5,
    unitPrice: 25.50,
    supplier: 'Clean Pro Services',
    isActive: true,
    createdAt: '2023-03-10T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '4',
    name: 'Sports Equipment',
    description: 'Basketball and soccer balls',
    category: 'Sports',
    quantity: 2,
    unitPrice: 45.00,
    supplier: 'Sports World',
    isActive: true,
    createdAt: '2023-04-05T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
]

const inventoryCategories = [
  'Stationery',
  'Electronics',
  'Maintenance',
  'Sports',
  'Furniture',
  'Books',
  'Laboratory',
  'Kitchen',
  'Medical',
  'Security',
]

export default function OperationsPage() {
  const [buses, setBuses] = useState<Bus[]>(mockBuses)
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>(mockBuses)
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(mockInventory)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [showAddBusDialog, setShowAddBusDialog] = useState(false)
  const [showAddInventoryDialog, setShowAddInventoryDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null)
  const [activeTab, setActiveTab] = useState('transport')

  // Filter data based on search and filters
  useEffect(() => {
    let filteredB = buses
    let filteredI = inventory

    if (searchTerm) {
      filteredB = buses.filter(bus =>
        bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.route.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      filteredI = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory) {
      filteredI = filteredI.filter(item => item.category === selectedCategory)
    }

    if (selectedStatus) {
      filteredB = filteredB.filter(bus => 
        selectedStatus === 'active' ? bus.isActive : !bus.isActive
      )
      filteredI = filteredI.filter(item => 
        selectedStatus === 'active' ? item.isActive : !item.isActive
      )
    }

    setFilteredBuses(filteredB)
    setFilteredInventory(filteredI)
  }, [searchTerm, selectedCategory, selectedStatus, buses, inventory])

  const handleAddBus = () => {
    setSelectedBus(null)
    setShowAddBusDialog(true)
  }

  const handleEditBus = (bus: Bus) => {
    setSelectedBus(bus)
    setShowEditDialog(true)
  }

  const handleDeleteBus = (busId: string) => {
    if (confirm('Are you sure you want to delete this bus?')) {
      setBuses(prev => prev.filter(bus => bus.id !== busId))
    }
  }

  const handleAddInventoryItem = () => {
    setSelectedInventoryItem(null)
    setShowAddInventoryDialog(true)
  }

  const handleEditInventoryItem = (item: InventoryItem) => {
    setSelectedInventoryItem(item)
    setShowEditDialog(true)
  }

  const handleDeleteInventoryItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setInventory(prev => prev.filter(item => item.id !== itemId))
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getStockStatusColor = (quantity: number) => {
    if (quantity === 0) return 'bg-red-100 text-red-800'
    if (quantity <= 10) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return 'Out of Stock'
    if (quantity <= 10) return 'Low Stock'
    return 'In Stock'
  }

  const formatPrice = (price: number | null) => {
    return price ? `$${price.toFixed(2)}` : 'N/A'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operations Management</h1>
          <p className="text-gray-600">Manage transportation, inventory, and maintenance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Maintenance Log
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bus className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Buses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {buses.filter(bus => bus.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inventory Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventory.filter(item => item.quantity <= 10).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${inventory.reduce((sum, item) => sum + (item.unitPrice || 0) * item.quantity, 0).toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transport">Transportation</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
        </TabsList>

        {/* Transportation Tab */}
        <TabsContent value="transport" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Transportation Filters
                </div>
                <Button size="sm" onClick={handleAddBus}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bus
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
                      placeholder="Search buses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
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

          {/* Buses Table */}
          <Card>
            <CardHeader>
              <CardTitle>Fleet Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bus Number</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBuses.map((bus) => (
                    <TableRow key={bus.id}>
                      <TableCell>
                        <div className="font-medium">{bus.busNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bus.driverName}</div>
                          <div className="text-sm text-gray-500">{bus.driverPhone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {bus.route}
                        </div>
                      </TableCell>
                      <TableCell>{bus.capacity} seats</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bus.isActive)}>
                          {bus.isActive ? 'Active' : 'Inactive'}
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
                            <DropdownMenuItem onClick={() => handleEditBus(bus)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Wrench className="mr-2 h-4 w-4" />
                              Maintenance
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteBus(bus.id)}
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
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Inventory Filters
                </div>
                <Button size="sm" onClick={handleAddInventoryItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
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
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All categories</SelectItem>
                      {inventoryCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">{item.quantity}</span>
                          <Badge className={getStockStatusColor(item.quantity)}>
                            {getStockStatus(item.quantity)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(item.unitPrice)}</TableCell>
                      <TableCell>
                        {formatPrice(item.unitPrice ? item.unitPrice * item.quantity : null)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.isActive)}>
                          {item.isActive ? 'Active' : 'Inactive'}
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
                            <DropdownMenuItem onClick={() => handleEditInventoryItem(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Stock
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteInventoryItem(item.id)}
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
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="w-5 h-5 mr-2" />
                Maintenance Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-gray-500">
                <Tool className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2">Maintenance Module</p>
                <p>Track maintenance requests, schedules, and work orders.</p>
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Maintenance Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facilities Tab */}
        <TabsContent value="facilities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Facilities Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2">Facilities Module</p>
                <p>Manage classrooms, laboratories, libraries, and other facilities.</p>
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Facility
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Bus Dialog */}
      <Dialog open={showAddBusDialog} onOpenChange={setShowAddBusDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Bus</DialogTitle>
            <DialogDescription>
              Enter the details of the new bus.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="busNumber">Bus Number</Label>
                <Input id="busNumber" placeholder="BUS001" />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" placeholder="50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="driverName">Driver Name</Label>
                <Input id="driverName" placeholder="John Driver" />
              </div>
              <div>
                <Label htmlFor="driverPhone">Driver Phone</Label>
                <Input id="driverPhone" placeholder="+1234567890" />
              </div>
            </div>
            <div>
              <Label htmlFor="route">Route</Label>
              <Input id="route" placeholder="Downtown - School" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddBusDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle add logic here
                setShowAddBusDialog(false)
              }}>
                Add Bus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Inventory Item Dialog */}
      <Dialog open={showAddInventoryDialog} onOpenChange={setShowAddInventoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>
              Enter the details of the new inventory item.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="itemName">Item Name</Label>
              <Input id="itemName" placeholder="Whiteboard Markers" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Item description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="25" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unitPrice">Unit Price</Label>
                <Input id="unitPrice" type="number" step="0.01" placeholder="15.99" />
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" placeholder="Office Supplies Co." />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddInventoryDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle add logic here
                setShowAddInventoryDialog(false)
              }}>
                Add Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
