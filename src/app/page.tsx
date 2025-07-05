import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  Shield,
  Smartphone,
  Globe,
  CheckCircle,
  ArrowRight,
  School,
  Star,
  Clock,
  Award,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <School className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">SchoolPro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Next-Generation School Management
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your School with{" "}
              <span className="text-blue-600">Smart Management</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive, AI-powered school management system that streamlines 
              operations, enhances learning, and connects your entire educational community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Try Demo
                </Button>
              </Link>
            </div>
            
            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
              <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Admin:</strong> admin@school.com / admin123</p>
                <p><strong>Teacher:</strong> teacher@school.com / teacher123</p>
                <p><strong>Student:</strong> student@school.com / student123</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Run a Modern School
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From student enrollment to graduation, manage every aspect of your 
              educational institution with our comprehensive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Student Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Student Management</CardTitle>
                <CardDescription>
                  Complete student lifecycle from admission to graduation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Digital admissions process
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Student profiles & records
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Academic progress tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Academic Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Academic Excellence</CardTitle>
                <CardDescription>
                  Streamlined curriculum and assessment management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Intelligent timetable generation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Assignment & grade management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Exam scheduling & results
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Staff Portal */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <GraduationCap className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Staff & HR</CardTitle>
                <CardDescription>
                  Comprehensive teacher and staff management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Teacher profiles & qualifications
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Payroll management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Performance tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Communication */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Parent Portal</CardTitle>
                <CardDescription>
                  Seamless school-home communication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time notifications
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Parent-teacher conferences
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Progress reports
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Data-driven insights for better decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Performance analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Attendance insights
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Financial reporting
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Security & Compliance</CardTitle>
                <CardDescription>
                  Enterprise-grade security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Role-based access control
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Data encryption
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    GDPR compliance
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Schools Choose SchoolPro
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of educational institutions worldwide who trust 
              SchoolPro to streamline their operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Time</h3>
              <p className="text-gray-600">
                Automate routine tasks and reduce administrative overhead by up to 60%
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Improve Quality</h3>
              <p className="text-gray-600">
                Enhance educational outcomes with data-driven insights and personalized learning
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Connected</h3>
              <p className="text-gray-600">
                Real-time communication between teachers, students, and parents
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scale Easily</h3>
              <p className="text-gray-600">
                Grow from a single campus to multiple locations with our scalable platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the thousands of schools already using SchoolPro to create 
            better educational experiences for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <School className="h-6 w-6" />
                <span className="text-lg font-bold">SchoolPro</span>
              </div>
              <p className="text-gray-400">
                The complete school management solution for the digital age.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-white">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SchoolPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
