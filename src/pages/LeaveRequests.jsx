import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, BeachAccess, CheckCircle, Cancel } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { getStatusColor, formatDate, calculateLeaveDays } from '../utils/helpers';
import { LEAVE_TYPES } from '../utils/constants';
import LeaveRequestForm from '../components/forms/LeaveRequestForm';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function LeaveRequests() {
  const { data, loading, addLeaveRequest } = useApi();
  const { hasPermission, userRole } = useAuth();
  const [openForm, setOpenForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
    employee: ''
  });
  const [confirmAction, setConfirmAction] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });


  const filteredRequests = data.leaveRequests.filter(req => {
    const matchesStatus = !filters.status || req.status === filters.status;
    const matchesType = !filters.leaveType || req.leaveType === filters.leaveType;
    const matchesEmployee = !filters.employee || req.employeeId === filters.employee;

    return matchesStatus && matchesType && matchesEmployee;
  });

  const handleAddRequest = () => {
    setOpenForm(true);
  };

  const handleFormSubmit = async (requestData) => {
    const result = await addLeaveRequest(requestData);
    setSnackbar({
      open: true,
      message: result.success ? 'Leave request submitted successfully' : 'Failed to submit leave request',
      severity: result.success ? 'success' : 'error'
    });

    if (result.success) {
      setOpenForm(false);
      setConfirmAction({
        type: 'submit',
        message: 'Your leave request has been submitted and is pending approval.'
      });
    }
  };

  const columns = [
    {
      field: 'employeeId',
      headerName: 'Employee',
      width: 200,
      renderCell: (params) => {
        const employee = data.employees.find(emp => emp.id === params.value);
        return employee ? `${employee.name} (${params.value})` : params.value;
      }
    },
    { field: 'leaveType', headerName: 'Leave Type', width: 150 },
    { 
      field: 'startDate', 
      headerName: 'Start Date', 
      width: 130,
      renderCell: (params) => formatDate(params.value)
    },
    { 
      field: 'endDate', 
      headerName: 'End Date', 
      width: 130,
      renderCell: (params) => formatDate(params.value)
    },
    {
      field: 'duration',
      headerName: 'Days',
      width: 80,
      renderCell: (params) => calculateLeaveDays(params.row.startDate, params.row.endDate)
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getStatusColor(params.value)}
          variant="outlined"
          size="small"
          icon={
            params.value === 'Approved' ? <CheckCircle /> :
            params.value === 'Rejected' ? <Cancel /> : 
            <BeachAccess />
          }
        />
      )
    },
    { field: 'reason', headerName: 'Reason', width: 200 },
    { 
      field: 'appliedDate', 
      headerName: 'Applied Date', 
      width: 130,
      renderCell: (params) => formatDate(params.value)
    }
  ];

  if (hasPermission('approve')) {
    columns.push({
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        params.row.status === 'Pending' ? (
          <Box>
            <Button
              size="small"
              color="success"
              startIcon={<CheckCircle />}
              onClick={() => handleStatusChange(params.row, 'Approved')}
              sx={{ mr: 1 }}
            >
              Approve
            </Button>
            <Button
              size="small"
              color="error"
              startIcon={<Cancel />}
              onClick={() => handleStatusChange(params.row, 'Rejected')}
            >
              Reject
            </Button>
          </Box>
        ) : null
      )
    });
  }

  const handleStatusChange = (request, status) => {
    setConfirmAction({
      type: 'status',
      request,
      status,
      message: `Are you sure you want to ${status.toLowerCase()} this leave request?`
    });
  };

  const confirmStatusChange = async () => {
    if (confirmAction && confirmAction.type === 'status') {
      console.log(`Leave request ${confirmAction.status.toLowerCase()}:`, confirmAction.request);
      setSnackbar({
        open: true,
        message: `Leave request ${confirmAction.status.toLowerCase()} successfully`,
        severity: 'success'
      });
      setConfirmAction(null);
    } else {
      setConfirmAction(null);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Leave Requests</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddRequest}
        >
          Request Leave
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={filters.leaveType}
                  label="Leave Type"
                  onChange={(e) => setFilters(prev => ({ ...prev, leaveType: e.target.value }))}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {LEAVE_TYPES.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Employee</InputLabel>
                <Select
                  value={filters.employee}
                  label="Employee"
                  onChange={(e) => setFilters(prev => ({ ...prev, employee: e.target.value }))}
                >
                  <MenuItem value="">All Employees</MenuItem>
                  {data.employees.map(emp => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setFilters({ status: '', leaveType: '', employee: '' })}
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
            rows={filteredRequests}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            loading={loading}
          />
        </div>
      </Card>

      {/* Leave Request Form Dialog */}
      <LeaveRequestForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        employees={data.employees}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={confirmAction?.type === 'status' ? confirmStatusChange : () => setConfirmAction(null)}
        title={confirmAction?.type === 'status' ? 'Confirm Action' : 'Leave Request Submitted'}
        message={confirmAction?.message || ''}
        confirmText={confirmAction?.type === 'status' ? confirmAction.status : 'OK'}
        severity={confirmAction?.status === 'Rejected' ? 'error' : 'primary'}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
