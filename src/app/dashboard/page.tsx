"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Bell,
  Plus,
  ArrowRight
} from "lucide-react";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
  attendanceRate: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  eventType: string;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  subject: {
    name: string;
  };
  class: {
    name: string;
    section: string;
  };
}

interface DashboardData {
  stats: DashboardStats;
  upcomingAssignments: Assignment[];
  announcements: Event[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!session || !dashboardData) {
    return null;
  }

  const { stats, upcomingAssignments, announcements } = dashboardData;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {session?.user?.name}!</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Active enrollments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">Faculty members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubjects}</div>
            <p className="text-xs text-muted-foreground">Curriculum subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Assignments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAssignments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming assignments</p>
            ) : (
              <div className="space-y-4">
                {upcomingAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{assignment.title}</h4>
                      <p className="text-sm text-gray-600">
                        {assignment.subject.name} - {assignment.class.name} {assignment.class.section}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        Pending
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {announcements.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent events</p>
            ) : (
              <div className="space-y-4">
                {announcements.map((event) => (
                  <div key={event.id} className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">{event.title}</h4>
                    <p className="text-sm text-blue-700 mt-1">{event.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {event.eventType}
                      </Badge>
                      <span className="text-xs text-blue-600">
                        {new Date(event.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Manage Students</p>
                  <p className="text-sm text-gray-600">Add, edit, or view student records</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-green-600" />
                <div className="text-left">
                  <p className="font-medium">Timetable</p>
                  <p className="text-sm text-gray-600">View and manage class schedules</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <div className="text-left">
                  <p className="font-medium">Assignments</p>
                  <p className="text-sm text-gray-600">Create and manage assignments</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
