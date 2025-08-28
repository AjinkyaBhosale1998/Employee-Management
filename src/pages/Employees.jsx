import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { formatDate, getStatusColor } from '../utils/helpers';
import EmployeeForm from '../components/forms/EmployeeForm';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Employees() {
  const { data, loading, addEmployee, updateEmployee, deleteEmployee } = useApi();
  const { hasPermission, userRole } = useAuth();
  const [openForm, setOpenForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    searchTerm: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const filteredEmployees = data.employees.filter(emp => {
    const matchesDepartment = !filters.department || emp.department === filters.department;
    const matchesSearch = !filters.searchTerm || 
      emp.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesDepartment && matchesSearch;
  });

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setOpenForm(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setOpenForm(true);
  };

  const handleDeleteEmployee = (employee) => {
    setConfirmDelete(employee);
  };

  const confirmDeleteEmployee = async () => {
    if (confirmDelete) {
      const result = await deleteEmployee(confirmDelete.id);
      if (result.success) {
        setSnackbar({ open: true, message: 'Employee deleted successfully', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to delete employee', severity: 'error' });
      }
      setConfirmDelete(null);
    }
  };

  const handleFormSubmit = async (employeeData) => {
    let result;
    if (editingEmployee) {
      result = await updateEmployee(editingEmployee.id, employeeData);
      setSnackbar({ 
        open: true, 
        message: result.success ? 'Employee updated successfully' : 'Failed to update employee',
        severity: result.success ? 'success' : 'error'
      });
    } else {
      result = await addEmployee(employeeData);
      setSnackbar({ 
        open: true, 
        message: result.success ? 'Employee added successfully' : 'Failed to add employee',
        severity: result.success ? 'success' : 'error'
      });
    }

    if (result.success) {
      setOpenForm(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'Employee ID', width: 120 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'contact', headerName: 'Contact', width: 130 },
    { field: 'department', headerName: 'Department', width: 150 },
    { 
      field: 'joiningDate', 
      headerName: 'Joining Date', 
      width: 130,
      renderCell: (params) => formatDate(params.value)
    },
    { field: 'role', headerName: 'Role', width: 120 },
    {
      field: 'leaveBalance',
      headerName: 'Leave Balance',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={`${params.value} days`} 
          size="small" 
          color={params.value > 15 ? 'success' : params.value > 5 ? 'warning' : 'error'}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          {hasPermission('write') && (
            <>
              <Button
                size="small"
                startIcon={<Edit />}
                onClick={() => handleEditEmployee(params.row)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<Delete />}
                onClick={() => handleDeleteEmployee(params.row)}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Employees</Typography>
        {hasPermission('write') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddEmployee}
          >
            Add Employee
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search"
                placeholder="Search by name, email, or ID"
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={filters.department}
                  label="Department"
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {data.departments.map(dept => (
                    <MenuItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setFilters({ department: '', searchTerm: '' })}
                sx={{ height: '56px' }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card>
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredEmployees}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection={hasPermission('delete')}
            disableSelectionOnClick
            loading={loading}
          />
        </div>
      </Card>

      {/* Employee Form Dialog */}
      <EmployeeForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        employee={editingEmployee}
        departments={data.departments}
        employees={data.employees}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteEmployee}
        title="Delete Employee"
        message={`Are you sure you want to delete ${confirmDelete?.name}? This action cannot be undone.`}
        severity="error"
        confirmText="Delete"
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
