# School Management System

A comprehensive, modern, full-stack school management system built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Modules
- **Student Lifecycle Management**: Admissions, enrollment, profiles, batch management
- **Academic Management**: Timetable automation, curriculum planning, assignments
- **Staff & HR**: Teacher portal, payroll, training tracker
- **Parent & Student Portals**: Real-time updates, fee payment, meeting booking
- **Operations Management**: Inventory, transportation, maintenance
- **Security & Compliance**: RBAC, data privacy, audit logs
- **Reporting & Dashboards**: Exportable reports, analytics, compliance reports

### Key Features
- ✅ **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- ✅ **Authentication**: NextAuth.js with role-based access control
- ✅ **Database**: SQLite with Prisma ORM (upgradeable to PostgreSQL)
- ✅ **Real-time Dashboard**: Live stats and updates
- ✅ **API Routes**: RESTful API endpoints for all operations
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Mobile Responsive**: Works on all devices
- 🔄 **AI Integration**: OpenAI API for intelligent features (coming soon)

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled UI components
- **shadcn/ui**: Beautiful UI components
- **Lucide React**: Modern icon library

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Prisma**: Type-safe database client
- **SQLite**: Local database (production-ready)
- **NextAuth.js**: Authentication framework
- **bcryptjs**: Password hashing

### Tools & Services
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **VS Code**: Development environment
- **npm**: Package management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd school-manage
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

4. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database:**
   ```bash
   npm run db:seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Credentials

After seeding the database, you can use these credentials:

- **Admin**: `admin@school.com` / `admin123`
- **Teacher**: `teacher@school.com` / `teacher123`
- **Student**: `student@school.com` / `student123`

## 📁 Project Structure

```
school-manage/
├── .env                        # Environment variables
├── .github/
│   └── copilot-instructions.md # AI coding guidelines
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   └── layout/           # Layout components
│   └── lib/                   # Utility functions
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database and reseed
```

## 🗃️ Database Schema

The system uses a comprehensive database schema with the following main entities:

### Core Entities
- **Users**: System users with role-based access
- **Schools**: Multi-tenant support
- **Academic Years**: Academic session management
- **Classes**: Class and section management
- **Subjects**: Curriculum subjects
- **Students**: Student profiles and records
- **Teachers**: Staff profiles and records
- **Parents**: Parent/guardian information

### Academic Entities
- **Timetables**: Class schedules
- **Assignments**: Homework and projects
- **Exams**: Examination management
- **Grades**: Student assessments
- **Attendance**: Daily attendance tracking

### Administrative Entities
- **Fees**: Fee structure and payments
- **Events**: School events and announcements
- **Staff**: Non-teaching staff records
- **Admins**: Administrative users

## 🛡️ Security Features

- **Role-Based Access Control (RBAC)**
- **Password Hashing** with bcryptjs
- **Session Management** with NextAuth.js
- **Route Protection** with middleware
- **Input Validation** with Zod
- **SQL Injection Protection** with Prisma

## 📱 API Documentation

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Dashboard
- `GET /api/dashboard` - Dashboard statistics

### Students
- `GET /api/students` - List students
- `POST /api/students` - Create student
- `GET /api/students/[id]` - Get student details
- `PUT /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student

### Timetable
- `GET /api/timetable` - Get timetable
- `POST /api/timetable` - Create timetable entry

## 🚦 Development Workflow

1. **Branch Strategy**: Use feature branches for new features
2. **Code Standards**: Follow TypeScript and React best practices
3. **Component Structure**: Use composition pattern for reusable components
4. **State Management**: Use React hooks and Context API
5. **Error Handling**: Implement proper error boundaries
6. **Testing**: Write unit tests for critical functions
7. **Documentation**: Update README and code comments

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core authentication and authorization
- ✅ Student management system
- ✅ Basic dashboard with real-time data
- ✅ Database schema and API endpoints

### Phase 2 (Next)
- 🔄 Advanced timetable management
- 🔄 Assignment and grading system
- 🔄 Parent portal
- 🔄 Fee management
- 🔄 Attendance tracking

### Phase 3 (Future)
- 🔄 AI-powered features
- 🔄 Mobile app (React Native/Flutter)
- 🔄 Advanced reporting
- 🔄 Integration with external services
- 🔄 Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Prisma](https://prisma.io/) - Database toolkit
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide](https://lucide.dev/) - Icons

## 📞 Support

For support, email support@schoolmanage.com or create an issue in the GitHub repository.

---

**Built with ❤️ by the School Management Team**
