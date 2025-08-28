import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Business, Person } from '@mui/icons-material';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import DepartmentForm from '../components/forms/DepartmentForm';

export default function Departments() {
  const { data, loading, addDepartment } = useApi();
  const { hasPermission } = useAuth();
  const [openForm, setOpenForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAddDepartment = () => {
    setOpenForm(true);
  };

  const handleFormSubmit = async (departmentData) => {
    const result = await addDepartment(departmentData);
    setSnackbar({
      open: true,
      message: result.success ? 'Department added successfully' : 'Failed to add department',
      severity: result.success ? 'success' : 'error'
    });

    if (result.success) {
      setOpenForm(false);
    }
  };

  const getDepartmentStats = (department) => {
    const employeeCount = data.employees.filter(emp => emp.department === department.name).length;
    const head = data.employees.find(emp => emp.id === department.head);
    return { employeeCount, head };
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Departments</Typography>
        {hasPermission('write') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddDepartment}
          >
            Add Department
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {data.departments.map((department) => {
          const stats = getDepartmentStats(department);

          return (
            <Grid item xs={12} md={6} lg={4} key={department.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <Business />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{department.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {department.location}
                      </Typography>
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Chip
                      icon={<Person />}
                      label={`${stats.employeeCount} Employees`}
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Department Head:
                    </Typography>
                    <Typography variant="body2">
                      {stats.head ? `${stats.head.name} (${stats.head.id})` : 'Not Assigned'}
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Recent Employees:
                    </Typography>
                    {data.employees
                      .filter(emp => emp.department === department.name)
                      .slice(0, 3)
                      .map(emp => (
                        <Typography key={emp.id} variant="body2">
                          • {emp.name}
                        </Typography>
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Department Form Dialog */}
      <DepartmentForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        employees={data.employees}
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
