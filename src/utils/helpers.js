// Helper utility functions
export const generateEmployeeId = (employees) => {
  const existingIds = employees.map(emp => parseInt(emp.id.replace('ER', '')));
  const nextId = Math.max(...existingIds, 0) + 1;
  return `ER${String(nextId).padStart(4, '0')}`;
};

export const generateInvoiceId = (invoices) => {
  const existingIds = invoices.map(inv => parseInt(inv.id.replace('INV', '')));
  const nextId = Math.max(...existingIds, 0) + 1;
  return `INV${String(nextId).padStart(3, '0')}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const getStatusColor = (status) => {
  const colors = {
    'Approved': 'success',
    'Pending': 'warning',
    'Rejected': 'error',
    'Submitted': 'info',
    'Under Review': 'warning',
    'Paid': 'success',
    'Overdue': 'error'
  };
  return colors[status] || 'default';
};

export const filterByDepartment = (data, department) => {
  if (!department) return data;
  return data.filter(item => item.department === department);
};

export const filterByDateRange = (data, startDate, endDate, dateField = 'joiningDate') => {
  if (!startDate && !endDate) return data;
  return data.filter(item => {
    const itemDate = new Date(item[dateField]);
    const start = startDate ? new Date(startDate) : new Date('1900-01-01');
    const end = endDate ? new Date(endDate) : new Date('2100-01-01');
    return itemDate >= start && itemDate <= end;
  });
};

export const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
};
