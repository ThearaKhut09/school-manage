import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  
  // Test database connection
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return;
  }

  // Hash passwords
  const adminPassword = await bcrypt.hash("admin123", 10);
  const teacherPassword = await bcrypt.hash("teacher123", 10);
  const studentPassword = await bcrypt.hash("student123", 10);

  // Create users first
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@school.com" },
    update: {},
    create: {
      email: "admin@school.com",
      name: "System Administrator",
      role: "ADMIN",
      password: adminPassword,
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher@school.com" },
    update: {},
    create: {
      email: "teacher@school.com",
      name: "John Smith",
      role: "TEACHER",
      password: teacherPassword,
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: "student@school.com" },
    update: {},
    create: {
      email: "student@school.com",
      name: "Alice Johnson",
      role: "STUDENT",
      password: studentPassword,
    },
  });

  // Create school
  const school = await prisma.school.upsert({
    where: { code: "DEMO001" },
    update: {},
    create: {
      name: "Demo School",
      code: "DEMO001",
      address: "123 School Street",
      phone: "+1234567890",
      email: "info@demoschool.com",
      principal: "Dr. Principal",
    },
  });

  // Create academic year
  const academicYear = await prisma.academicYear.upsert({
    where: { 
      schoolId_name: {
        schoolId: school.id,
        name: "2024-2025"
      }
    },
    update: {},
    create: {
      schoolId: school.id,
      name: "2024-2025",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-06-30"),
      isActive: true,
    },
  });

  // Create subjects
  await prisma.subject.upsert({
    where: {
      schoolId_academicYearId_code: {
        schoolId: school.id,
        academicYearId: academicYear.id,
        code: "MATH"
      }
    },
    update: {},
    create: {
      schoolId: school.id,
      academicYearId: academicYear.id,
      name: "Mathematics",
      code: "MATH",
      description: "Basic mathematics and arithmetic",
    },
  });

  await prisma.subject.upsert({
    where: {
      schoolId_academicYearId_code: {
        schoolId: school.id,
        academicYearId: academicYear.id,
        code: "ENG"
      }
    },
    update: {},
    create: {
      schoolId: school.id,
      academicYearId: academicYear.id,
      name: "English",
      code: "ENG",
      description: "English language and literature",
    },
  });

  // Create class
  const classA = await prisma.class.upsert({
    where: {
      schoolId_academicYearId_name_section: {
        schoolId: school.id,
        academicYearId: academicYear.id,
        name: "Class 1",
        section: "A"
      }
    },
    update: {},
    create: {
      schoolId: school.id,
      academicYearId: academicYear.id,
      name: "Class 1",
      section: "A",
      capacity: 30,
      roomNumber: "Room 101",
    },
  });

  // Create teacher
  await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      userId: teacherUser.id,
      schoolId: school.id,
      employeeId: "TCH001",
      phone: "+1234567890",
      address: "123 Teacher Street",
      emergencyPhone: "+1234567891",
      qualification: "Master of Education",
      department: "Mathematics",
      salary: 50000,
      dateOfJoining: new Date("2020-01-15"),
    },
  });

  // Create student
  await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      schoolId: school.id,
      classId: classA.id,
      admissionNo: "STU001",
      rollNumber: "001",
      dateOfBirth: new Date("2012-04-10"),
      gender: "FEMALE",
      address: "789 Student Road",
      emergencyPhone: "+1234567892",
      admissionDate: new Date("2023-01-15"),
    },
  });

  // Create admin
  await prisma.admin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      schoolId: school.id,
      level: "SCHOOL",
    },
  });

  // Create an event (as there's no announcement model)
  await prisma.event.create({
    data: {
      schoolId: school.id,
      title: "Welcome to the new school year!",
      description: "We are excited to welcome all students and staff to the new academic year. Let's make it a great year of learning and growth.",
      startDate: new Date(),
      eventType: "ACADEMIC",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("📧 Admin: admin@school.com (password: admin123)");
  console.log("👨‍🏫 Teacher: teacher@school.com (password: teacher123)");
  console.log("👩‍🎓 Student: student@school.com (password: student123)");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
