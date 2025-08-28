// Mock data for the application
export const mockEmployees = [
  {
    id: "ER0001",
    name: "Virat Kohli",
    email: "virat.kohli@company.com",
    contact: "9876543210",
    department: "Information Technology",
    joiningDate: "2025-08-15",
    reportingManager: "ER0002",
    role: "Developer",
    leaveBalance: 20
  },
  {
    id: "ER0002", 
    name: "Ajinkya Rahane",
    email: "ajinkya.rahane@company.com",
    contact: "9876543211",
    department: "Information Technology",
    joiningDate: "2025-08-10",
    reportingManager: "",
    role: "Manager",
    leaveBalance: 25
  },
  {
    id: "ER0003",
    name: "Ranvindra Jadeja", 
    email: "ranvindra.jadeja@company.com",
    contact: "9876543212",
    department: "Finance",
    joiningDate: "2025-08-20",
    reportingManager: "ER0004",
    role: "Analyst",
    leaveBalance: 18
  },
  {
    id: "ER0004",
    name: "Jaspreet Bumrah",
    email: "jaspreet.bumrah@company.com", 
    contact: "9876543213",
    department: "Finance",
    joiningDate: "2025-08-05",
    reportingManager: "",
    role: "Manager",
    leaveBalance: 25
  },
  {
    id: "ER0005",
    name: "Hardik Pandya",
    email: "hardik.pandya@company.com",
    contact: "9876543214", 
    department: "Human Resources",
    joiningDate: "2025-08-14",
    reportingManager: "ER0006",
    role: "Executive",
    leaveBalance: 22
  },
  {
    id: "ER0006",
    name: "Rohit Sharma",
    email: "rohit.sharma@company.com",
    contact: "9876543215",
    department: "Human Resources", 
    joiningDate: "2022-08-30",
    reportingManager: "",
    role: "Manager",
    leaveBalance: 25
  }
];

export const mockDepartments = [
  {
    id: 1,
    name: "Information Technology",
    shortName: "IT", 
    head: "ER0002",
    location: "Pune, VTP"
  },
  {
    id: 2,
    name: "Finance",
    shortName: "Finance",
    head: "ER0004", 
    location: "Mumabi Hiaranandni B2"
  },
  {
    id: 3,
    name: "Human Resources",
    shortName: "HR",
    head: "ER0006",
    location: "Della, Floor 1"
  },
  {
    id: 4,
    name: "Marketing", 
    shortName: "Marketing",
    head: "ER0007",
    location: "Krishala B, Floor 1"
  }
];

export const mockProjects = [
  {
    id: 1,
    name: "Customer Portal Development",
    manager: "ER0002",
    budget: 150000,
    status: "Under Review", 
    submissionDate: "2024-01-15",
    teamMembers: [
      { employee: "ER0001", role: "Lead Developer" },
      { employee: "ER0003", role: "Business Analyst" }
    ]
  },
  {
    id: 2,
    name: "Mobile App Redesign",
    manager: "ER0002",
    budget: 80000,
    status: "Approved",
    submissionDate: "2024-01-10", 
    teamMembers: [
      { employee: "ER0001", role: "Frontend Developer" }
    ]
  },
  {
    id: 3,
    name: "Data Analytics Platform", 
    manager: "ER0004",
    budget: 200000,
    status: "Submitted",
    submissionDate: "2024-01-20",
    teamMembers: [
      { employee: "ER0003", role: "Data Analyst" }
    ]
  }
];

export const mockInvoices = [
  {
    id: "INV001",
    clientName: "ABC Corporation",
    amount: 45000,
    dueDate: "2024-02-15",
    status: "Paid", 
    project: 1,
    generatedDate: "2024-01-15"
  },
  {
    id: "INV002", 
    clientName: "XYZ Ltd",
    amount: 32000,
    dueDate: "2024-02-20",
    status: "Pending",
    project: 2,
    generatedDate: "2024-01-20"
  },
  {
    id: "INV003",
    clientName: "Tech Solutions",
    amount: 67000,
    dueDate: "2024-03-01", 
    status: "Overdue",
    project: 3,
    generatedDate: "2024-01-25"
  }
];

export const mockLeaveRequests = [
  {
    id: 1,
    employeeId: "ER0001",
    leaveType: "Annual Leave",
    startDate: "2024-02-10",
    endDate: "2024-02-14",
    reason: "Family vacation",
    status: "Approved",
    appliedDate: "2024-01-25"
  },
  {
    id: 2,
    employeeId: "ER0003",
    leaveType: "Sick Leave", 
    startDate: "2024-02-05",
    endDate: "2024-02-06", 
    reason: "Medical appointment",
    status: "Pending",
    appliedDate: "2024-02-01"
  },
  {
    id: 3,
    employeeId: "ER0005",
    leaveType: "Personal Leave",
    startDate: "2024-02-15",
    endDate: "2024-02-16",
    reason: "Personal work", 
    status: "Rejected",
    appliedDate: "2024-01-30"
  }
];
