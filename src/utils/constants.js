// Application constants
export const USER_ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager', 
  EMPLOYEE: 'Employee'
};

export const PROJECT_STATUSES = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

export const INVOICE_STATUSES = {
  PAID: 'Paid',
  PENDING: 'Pending',
  OVERDUE: 'Overdue',
  CANCELLED: 'Cancelled'
};

export const LEAVE_STATUSES = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

export const LEAVE_TYPES = [
  'Annual Leave',
  'Sick Leave', 
  'Personal Leave',
  'Maternity Leave',
  'Paternity Leave',
  'Emergency Leave'
];

export const DEPARTMENTS = [
  'Information Technology',
  'Finance',
  'Human Resources',
  'Marketing',
  'Operations'
];

export const PERMISSIONS = {
  [USER_ROLES.ADMIN]: ['read', 'write', 'delete', 'approve'],
  [USER_ROLES.MANAGER]: ['read', 'write', 'approve'],
  [USER_ROLES.EMPLOYEE]: ['read']
};
