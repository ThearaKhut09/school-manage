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
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  BookCheck, 
  AlertCircle,
  Download,
  Upload,
  QrCode,
  CheckCircle
} from 'lucide-react'

interface Book {
  id: number
  title: string
  author: string
  isbn: string
  category: string
  publisher: string
  publicationYear: number
  totalCopies: number
  availableCopies: number
  location: string
  language: string
  pages: number
  description: string
  addedDate: string
  status: string
}

interface Issue {
  id: number
  bookId: number
  bookTitle: string
  studentId: string
  studentName: string
  issueDate: string
  dueDate: string
  returnDate: string | null
  status: string
  fineAmount: number
}

interface LibraryStats {
  totalBooks: number
  totalCopies: number
  availableCopies: number
  issuedBooks: number
  overdueBooks: number
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [issues, setIssues] = useState<Issue[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [stats, setStats] = useState<LibraryStats>({
    totalBooks: 0,
    totalCopies: 0,
    availableCopies: 0,
    issuedBooks: 0,
    overdueBooks: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false)
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false)
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('books')

  useEffect(() => {
    fetchBooks()
    fetchIssues()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/library?type=books')
      const data = await response.json()
      setBooks(data.books || [])
      setCategories(data.categories || [])
      setStats(data.stats || stats)
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/library?type=issues')
      const data = await response.json()
      setIssues(data.issues || [])
    } catch (error) {
      console.error('Error fetching issues:', error)
    }
  }

  const handleBookSave = async (bookData: Partial<Book>) => {
    try {
      const method = selectedBook ? 'PUT' : 'POST'
      const url = '/api/library'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'book',
          id: selectedBook?.id,
          ...bookData
        }),
      })

      if (response.ok) {
        fetchBooks()
        setIsBookDialogOpen(false)
        setSelectedBook(null)
      }
    } catch (error) {
      console.error('Error saving book:', error)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleIssueBook = async (issueData: { bookId: number; studentId: string; studentName: string }) => {
    try {
      const response = await fetch('/api/library', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'issue',
          ...issueData
        }),
      })

      if (response.ok) {
        fetchBooks()
        fetchIssues()
        setIsIssueDialogOpen(false)
      }
    } catch (error) {
      console.error('Error issuing book:', error)
    }
  }

  const handleReturnBook = async (issueId: number) => {
    try {
      const response = await fetch('/api/library', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'return',
          id: issueId
        }),
      })

      if (response.ok) {
        fetchBooks()
        fetchIssues()
        setIsReturnDialogOpen(false)
        setSelectedIssue(null)
      }
    } catch (error) {
      console.error('Error returning book:', error)
    }
  }

  const handleBookDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/library?type=book&id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchBooks()
      }
    } catch (error) {
      console.error('Error deleting book:', error)
    }
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm)
    const matchesCategory = !categoryFilter || book.category === categoryFilter
    const matchesStatus = !statusFilter || book.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || issue.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'issued':
        return 'bg-blue-100 text-blue-800'
      case 'returned':
        return 'bg-green-100 text-green-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const BookDialog = ({ book, onSave, onClose }: { book?: Book; onSave: (data: Partial<Book>) => void; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      title: book?.title || '',
      author: book?.author || '',
      isbn: book?.isbn || '',
      category: book?.category || '',
      publisher: book?.publisher || '',
      publicationYear: book?.publicationYear || new Date().getFullYear(),
      totalCopies: book?.totalCopies || 1,
      location: book?.location || '',
      language: book?.language || 'English',
      pages: book?.pages || 0,
      description: book?.description || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fiction">Fiction</SelectItem>
                <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Literature">Literature</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Reference">Reference</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="publisher">Publisher</Label>
            <Input
              id="publisher"
              value={formData.publisher}
              onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="publicationYear">Publication Year</Label>
            <Input
              id="publicationYear"
              type="number"
              value={formData.publicationYear}
              onChange={(e) => setFormData({ ...formData, publicationYear: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="totalCopies">Total Copies</Label>
            <Input
              id="totalCopies"
              type="number"
              value={formData.totalCopies}
              onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) })}
              min="1"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., A-1-001"
            />
          </div>
          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="pages">Pages</Label>
            <Input
              id="pages"
              type="number"
              value={formData.pages}
              onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) })}
              min="1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {book ? 'Update Book' : 'Add Book'}
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
          <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
          <p className="text-gray-600 mt-2">Manage books, issues, and library operations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Books
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <QrCode className="w-4 h-4 mr-2" />
            Generate Barcodes
          </Button>
        </div>
      </div>

      {/* Library Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-gray-600">Unique titles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Copies</CardTitle>
            <BookCheck className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCopies}</div>
            <p className="text-xs text-gray-600">All copies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableCopies}</div>
            <p className="text-xs text-gray-600">Ready to issue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issued</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.issuedBooks}</div>
            <p className="text-xs text-gray-600">Currently out</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueBooks}</div>
            <p className="text-xs text-gray-600">Past due date</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="issues">Issues & Returns</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="books" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Book Collection</CardTitle>
                  <CardDescription>
                    Manage your library&apos;s book inventory
                  </CardDescription>
                </div>
                <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Book
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedBook ? 'Edit Book' : 'Add New Book'}
                      </DialogTitle>
                      <DialogDescription>
                        Enter the book details below
                      </DialogDescription>
                    </DialogHeader>
                    <BookDialog
                      book={selectedBook || undefined}
                      onSave={handleBookSave}
                      onClose={() => setIsBookDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
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

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>ISBN</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Copies</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{book.title}</div>
                            <div className="text-sm text-gray-600">{book.publisher}</div>
                          </div>
                        </TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.isbn}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{book.category}</Badge>
                        </TableCell>
                        <TableCell>{book.totalCopies}</TableCell>
                        <TableCell>
                          <span className={book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}>
                            {book.availableCopies}
                          </span>
                        </TableCell>
                        <TableCell>{book.location}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(book.status)}>
                            {book.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBook(book)
                                setIsBookDialogOpen(true)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBookDelete(book.id)}
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

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Book Issues & Returns</CardTitle>
                  <CardDescription>
                    Track book lending and returns
                  </CardDescription>
                </div>
                <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Issue Book
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Issue Book</DialogTitle>
                      <DialogDescription>
                        Issue a book to a student
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="book">Select Book</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a book" />
                          </SelectTrigger>
                          <SelectContent>
                            {books.filter(book => book.availableCopies > 0).map((book) => (
                              <SelectItem key={book.id} value={book.id.toString()}>
                                {book.title} - {book.author}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          placeholder="Enter student ID"
                        />
                      </div>
                      <div>
                        <Label htmlFor="studentName">Student Name</Label>
                        <Input
                          id="studentName"
                          placeholder="Enter student name"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsIssueDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsIssueDialogOpen(false)}>
                          Issue Book
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="issued">Issued</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fine</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIssues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell>
                          <div className="font-medium">{issue.bookTitle}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{issue.studentName}</div>
                            <div className="text-sm text-gray-600">{issue.studentId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{issue.issueDate}</TableCell>
                        <TableCell>{issue.dueDate}</TableCell>
                        <TableCell>{issue.returnDate || '-'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(issue.status)}>
                            {issue.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {issue.fineAmount > 0 ? (
                            <span className="text-red-600">${issue.fineAmount}</span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {issue.status === 'issued' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedIssue(issue)
                                setIsReturnDialogOpen(true)
                              }}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Return
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Library Members</CardTitle>
              <CardDescription>
                Manage library membership and member information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Member Management</h3>
                <p className="text-gray-600">
                  This feature will show all registered library members, their borrowing history, and membership status.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Books</CardTitle>
                <CardDescription>
                  Most frequently borrowed books
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {books.slice(0, 5).map((book) => (
                    <div key={book.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-gray-600">{book.author}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{book.totalCopies - book.availableCopies}</div>
                        <div className="text-sm text-gray-600">times borrowed</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overdue Books</CardTitle>
                <CardDescription>
                  Books that need to be returned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {issues.filter(issue => issue.status === 'overdue').map((issue) => (
                    <div key={issue.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{issue.bookTitle}</div>
                        <div className="text-sm text-gray-600">{issue.studentName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-red-600">${issue.fineAmount}</div>
                        <div className="text-sm text-gray-600">fine</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Return Book Dialog */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Book</DialogTitle>
            <DialogDescription>
              Confirm book return for {selectedIssue?.studentName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium">{selectedIssue?.bookTitle}</h4>
              <p className="text-sm text-gray-600">
                Due: {selectedIssue?.dueDate}
              </p>
              {selectedIssue && new Date(selectedIssue.dueDate) < new Date() && (
                <p className="text-sm text-red-600">
                  This book is overdue. A fine may be applied.
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsReturnDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => selectedIssue && handleReturnBook(selectedIssue.id)}>
                Process Return
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
