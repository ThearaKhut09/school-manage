'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  DollarSign,
  Bus,
  Settings,
  Bell,
  Menu,
  X,
  Home,
  UserCheck,
  BarChart3,
  ClipboardList,
  Package,
  Phone,
  Shield,
  ChevronDown,
  User,
  LogOut,
} from 'lucide-react'

interface MenuItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  submenu?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Student Management',
    href: '/students',
    icon: Users,
    submenu: [
      { title: 'All Students', href: '/students', icon: Users },
      { title: 'Admissions', href: '/students/admissions', icon: UserCheck },
      { title: 'Batch Management', href: '/students/batches', icon: GraduationCap },
      { title: 'Attendance', href: '/students/attendance', icon: UserCheck },
    ],
  },
  {
    title: 'Academic',
    href: '/academic',
    icon: BookOpen,
    submenu: [
      { title: 'Timetable', href: '/academic/timetable', icon: Calendar },
      { title: 'Subjects', href: '/academic/subjects', icon: BookOpen },
      { title: 'Assignments', href: '/academic/assignments', icon: FileText },
      { title: 'Exams', href: '/academic/exams', icon: ClipboardList },
    ],
  },
  {
    title: 'Teachers',
    href: '/teachers',
    icon: GraduationCap,
    submenu: [
      { title: 'All Teachers', href: '/teachers', icon: GraduationCap },
      { title: 'Attendance', href: '/teachers/attendance', icon: UserCheck },
      { title: 'Performance', href: '/teachers/performance', icon: BarChart3 },
    ],
  },
  {
    title: 'Fees',
    href: '/fees',
    icon: DollarSign,
    submenu: [
      { title: 'Fee Structure', href: '/fees/structure', icon: DollarSign },
      { title: 'Payments', href: '/fees/payments', icon: DollarSign },
      { title: 'Reports', href: '/fees/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Operations',
    href: '/operations',
    icon: Settings,
    submenu: [
      { title: 'Transportation', href: '/operations/transport', icon: Bus },
      { title: 'Inventory', href: '/operations/inventory', icon: Package },
      { title: 'Maintenance', href: '/operations/maintenance', icon: Settings },
    ],
  },
  {
    title: 'Communications',
    href: '/communications',
    icon: Phone,
    submenu: [
      { title: 'Announcements', href: '/communications/announcements', icon: Bell },
      { title: 'Messages', href: '/communications/messages', icon: Phone },
      { title: 'Events', href: '/communications/events', icon: Calendar },
    ],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
    badge: 3,
  },
  {
    title: 'Administration',
    href: '/admin',
    icon: Shield,
    submenu: [
      { title: 'Users', href: '/admin/users', icon: Users },
      { title: 'Settings', href: '/admin/settings', icon: Settings },
      { title: 'Audit Logs', href: '/admin/audit', icon: FileText },
    ],
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-800">SchoolMS</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item) => (
            <div key={item.title} className="mb-1">
              {item.submenu ? (
                <div>
                  <Button
                    variant="ghost"
                    className={`w-full justify-between px-3 py-2 text-left font-medium ${
                      isActive(item.href) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleExpanded(item.title)}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      expandedItems.includes(item.title) ? 'rotate-180' : ''
                    }`} />
                  </Button>
                  {expandedItems.includes(item.title) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                            isActive(subItem.href)
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome back, Admin
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.jpg" alt="User" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        admin@school.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
