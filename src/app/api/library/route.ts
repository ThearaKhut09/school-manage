import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock library data
const mockBooks = [
  {
    id: 1,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    category: 'Fiction',
    publisher: 'J.B. Lippincott & Co.',
    publicationYear: 1960,
    totalCopies: 5,
    availableCopies: 3,
    location: 'A-1-001',
    language: 'English',
    pages: 281,
    description: 'A classic novel about racial injustice and moral growth in the American South.',
    addedDate: '2024-01-01',
    status: 'active'
  },
  {
    id: 2,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    category: 'Fiction',
    publisher: 'Scribner',
    publicationYear: 1925,
    totalCopies: 4,
    availableCopies: 2,
    location: 'A-1-002',
    language: 'English',
    pages: 180,
    description: 'A tale of wealth, love, and the American Dream in the Jazz Age.',
    addedDate: '2024-01-02',
    status: 'active'
  },
  {
    id: 3,
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '978-0-262-03384-8',
    category: 'Computer Science',
    publisher: 'MIT Press',
    publicationYear: 2009,
    totalCopies: 3,
    availableCopies: 1,
    location: 'B-2-045',
    language: 'English',
    pages: 1292,
    description: 'Comprehensive introduction to algorithms and data structures.',
    addedDate: '2024-01-03',
    status: 'active'
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0-14-143951-8',
    category: 'Fiction',
    publisher: 'Penguin Classics',
    publicationYear: 1813,
    totalCopies: 6,
    availableCopies: 4,
    location: 'A-1-015',
    language: 'English',
    pages: 432,
    description: 'A romantic novel about manners, upbringing, and marriage.',
    addedDate: '2024-01-04',
    status: 'active'
  },
  {
    id: 5,
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    isbn: '978-1-285-74155-0',
    category: 'Mathematics',
    publisher: 'Cengage Learning',
    publicationYear: 2015,
    totalCopies: 8,
    availableCopies: 5,
    location: 'C-3-102',
    language: 'English',
    pages: 1344,
    description: 'Comprehensive calculus textbook for engineering and science students.',
    addedDate: '2024-01-05',
    status: 'active'
  }
]

const mockIssues = [
  {
    id: 1,
    bookId: 1,
    bookTitle: 'To Kill a Mockingbird',
    studentId: 'ST001',
    studentName: 'John Smith',
    issueDate: '2024-01-10',
    dueDate: '2024-01-24',
    returnDate: null,
    status: 'issued',
    fineAmount: 0
  },
  {
    id: 2,
    bookId: 2,
    bookTitle: 'The Great Gatsby',
    studentId: 'ST002',
    studentName: 'Jane Doe',
    issueDate: '2024-01-08',
    dueDate: '2024-01-22',
    returnDate: null,
    status: 'overdue',
    fineAmount: 5.00
  },
  {
    id: 3,
    bookId: 3,
    bookTitle: 'Introduction to Algorithms',
    studentId: 'ST003',
    studentName: 'Bob Johnson',
    issueDate: '2024-01-05',
    dueDate: '2024-01-19',
    returnDate: '2024-01-18',
    status: 'returned',
    fineAmount: 0
  }
]

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'books'
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    if (type === 'books') {
      let filteredBooks = mockBooks

      if (search) {
        filteredBooks = filteredBooks.filter(book =>
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase()) ||
          book.isbn.includes(search)
        )
      }

      if (category) {
        filteredBooks = filteredBooks.filter(book => book.category === category)
      }

      if (status) {
        filteredBooks = filteredBooks.filter(book => book.status === status)
      }

      const categories = [...new Set(mockBooks.map(book => book.category))]

      return NextResponse.json({
        books: filteredBooks,
        total: filteredBooks.length,
        categories,
        stats: {
          totalBooks: mockBooks.length,
          totalCopies: mockBooks.reduce((sum, book) => sum + book.totalCopies, 0),
          availableCopies: mockBooks.reduce((sum, book) => sum + book.availableCopies, 0),
          issuedBooks: mockIssues.filter(issue => issue.status === 'issued').length,
          overdueBooks: mockIssues.filter(issue => issue.status === 'overdue').length
        }
      })
    } else if (type === 'issues') {
      let filteredIssues = mockIssues

      if (search) {
        filteredIssues = filteredIssues.filter(issue =>
          issue.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
          issue.studentName.toLowerCase().includes(search.toLowerCase()) ||
          issue.studentId.toLowerCase().includes(search.toLowerCase())
        )
      }

      if (status) {
        filteredIssues = filteredIssues.filter(issue => issue.status === status)
      }

      return NextResponse.json({
        issues: filteredIssues,
        total: filteredIssues.length
      })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching library data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch library data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, ...data } = body

    if (type === 'book') {
      const newBook = {
        id: mockBooks.length + 1,
        ...data,
        addedDate: new Date().toISOString().split('T')[0],
        status: 'active'
      }

      mockBooks.push(newBook)
      return NextResponse.json(newBook, { status: 201 })
    } else if (type === 'issue') {
      const { bookId, studentId, studentName } = data
      
      const book = mockBooks.find(b => b.id === bookId)
      if (!book) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 })
      }

      if (book.availableCopies <= 0) {
        return NextResponse.json({ error: 'No copies available' }, { status: 400 })
      }

      const issueDate = new Date()
      const dueDate = new Date(issueDate)
      dueDate.setDate(dueDate.getDate() + 14) // 14 days loan period

      const newIssue = {
        id: mockIssues.length + 1,
        bookId,
        bookTitle: book.title,
        studentId,
        studentName,
        issueDate: issueDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        returnDate: null,
        status: 'issued',
        fineAmount: 0
      }

      mockIssues.push(newIssue)
      
      // Update available copies
      book.availableCopies -= 1

      return NextResponse.json(newIssue, { status: 201 })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Error creating library entry:', error)
    return NextResponse.json(
      { error: 'Failed to create library entry' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, id, ...data } = body

    if (type === 'book') {
      const index = mockBooks.findIndex(book => book.id === id)
      
      if (index === -1) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 })
      }

      mockBooks[index] = { ...mockBooks[index], ...data }
      return NextResponse.json(mockBooks[index])
    } else if (type === 'return') {
      const index = mockIssues.findIndex(issue => issue.id === id)
      
      if (index === -1) {
        return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
      }

      const issue = mockIssues[index]
      const returnDate = new Date()
      const dueDate = new Date(issue.dueDate)
      
      // Calculate fine for overdue books
      let fineAmount = 0
      if (returnDate > dueDate) {
        const daysLate = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
        fineAmount = daysLate * 1 // $1 per day fine
      }

      issue.returnDate = returnDate.toISOString().split('T')[0]
      issue.status = 'returned'
      issue.fineAmount = fineAmount

      // Update available copies
      const book = mockBooks.find(b => b.id === issue.bookId)
      if (book) {
        book.availableCopies += 1
      }

      return NextResponse.json(issue)
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Error updating library entry:', error)
    return NextResponse.json(
      { error: 'Failed to update library entry' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      )
    }

    if (type === 'book') {
      const index = mockBooks.findIndex(book => book.id === parseInt(id))
      
      if (index === -1) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 })
      }

      mockBooks.splice(index, 1)
      return NextResponse.json({ message: 'Book deleted successfully' })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Error deleting library entry:', error)
    return NextResponse.json(
      { error: 'Failed to delete library entry' },
      { status: 500 }
    )
  }
}
