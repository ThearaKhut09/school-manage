# School Management System - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a comprehensive school management system built with:
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and App Router
- **Backend**: Node.js with Express API routes
- **Database**: SQLite with Prisma ORM (upgradeable to PostgreSQL)
- **AI Integration**: OpenAI API for intelligent features
- **Authentication**: NextAuth.js with role-based access control
- **UI Components**: Radix UI and shadcn/ui components

## Architecture Guidelines

### Core Modules
1. **Student Lifecycle Management**: Admissions, enrollment, profiles, batch management
2. **Academic Management**: Timetable automation, curriculum planning, assignments
3. **Staff & HR**: Teacher portal, payroll, training tracker
4. **Parent & Student Portals**: Real-time updates, fee payment, meeting booking
5. **Operations Management**: Inventory, transportation, maintenance
6. **Security & Compliance**: RBAC, data privacy, audit logs
7. **Reporting & Dashboards**: Exportable reports, analytics, compliance reports

### Code Standards
- Use TypeScript for type safety
- Follow React Server Components pattern where possible
- Use Tailwind CSS for styling with consistent design tokens
- Implement proper error handling and loading states
- Use Prisma for database operations with proper relations
- Implement proper authentication middleware
- Use React Hook Form for form handling
- Follow Next.js App Router conventions

### AI Integration
- Implement intelligent timetable generation
- Use predictive analytics for student performance
- Add smart attendance tracking
- Implement document OCR for data extraction
- Create chat assistants for common queries

### Security Considerations
- Implement role-based access control (Admin, Teacher, Parent, Student)
- Use proper session management
- Implement data encryption for sensitive information
- Add audit logging for all critical operations
- Follow GDPR/FERPA compliance requirements

### Performance Optimization
- Use Next.js Image optimization
- Implement proper caching strategies
- Use React.memo for expensive components
- Implement virtualization for large data sets
- Use proper database indexing

### Mobile Responsiveness
- Design mobile-first approach
- Use responsive design patterns
- Implement touch-friendly interactions
- Consider offline functionality where appropriate

When generating code, prioritize:
1. Type safety and proper TypeScript usage
2. Component reusability and composition
3. Performance and accessibility
4. Security best practices
5. Clean, maintainable code structure
