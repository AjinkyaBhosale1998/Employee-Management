import * as yup from 'yup';

// Employee form validation schema
export const employeeValidationSchema = yup.object({
  name: yup.string().required('Employee name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  contact: yup.string()
    .matches(/^[0-9]+$/, 'Contact must contain only numeric values')
    .required('Contact number is required'),
  department: yup.string().required('Department is required'),
  joiningDate: yup.date()
    .max(new Date(), 'Joining date cannot be in the future')
    .required('Joining date is required'),
  reportingManager: yup.string()
});

// Department form validation schema
export const departmentValidationSchema = yup.object({
  name: yup.string().required('Department name is required'),
  location: yup.string().required('Location is required'),
  head: yup.string().required('Department head is required')
});

// Project proposal validation schema
export const projectValidationSchema = yup.object({
  name: yup.string().required('Project name is required'),
  manager: yup.string().required('Project manager is required'),
  budget: yup.number()
    .positive('Budget must be a positive number')
    .required('Budget is required'),
  submissionDate: yup.date()
    .min(new Date(), 'Submission date cannot be in the past')
    .required('Submission date is required'),
  teamMembers: yup.array()
    .min(1, 'At least one team member is required')
    .required('Team members are required')
});

// Invoice form validation schema
export const invoiceValidationSchema = yup.object({
  clientName: yup.string().required('Client name is required'),
  amount: yup.number()
    .positive('Amount must be a positive number')
    .required('Amount is required'),
  dueDate: yup.date()
    .min(new Date(), 'Due date cannot be in the past')
    .required('Due date is required'),
  project: yup.string().required('Project is required')
});

// Leave request validation schema
export const leaveValidationSchema = yup.object({
  employeeId: yup.string().required('Employee is required'),
  leaveType: yup.string().required('Leave type is required'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date()
    .min(yup.ref('startDate'), 'End date must be after start date')
    .required('End date is required'),
  reason: yup.string().required('Reason is required')
});
