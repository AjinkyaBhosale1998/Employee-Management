import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper
} from '@mui/material';
import {
  People,
  Business,
  Assignment,
  Receipt
} from '@mui/icons-material';
import { useApi } from '../hooks/useApi';
import SummaryCards from '../components/dashboard/SummaryCards';
import Charts from '../components/dashboard/Charts';

export default function Dashboard() {
  const { data } = useApi();

  const summaryData = [
    {
      title: 'Total Employees',
      value: data.employees.length,
      icon: <People />,
      color: '#1976d2'
    },
    {
      title: 'Departments',
      value: data.departments.length,
      icon: <Business />,
      color: '#388e3c'
    },
    {
      title: 'Active Projects',
      value: data.projects.filter(p => p.status !== 'Rejected').length,
      icon: <Assignment />,
      color: '#f57c00'
    },
    {
      title: 'Pending Invoices',
      value: data.invoices.filter(i => i.status === 'Pending').length,
      icon: <Receipt />,
      color: '#d32f2f'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Overview of your Employee Management System
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12}>
          <SummaryCards data={summaryData} />
        </Grid>

        {/* Charts Section */}
        <Grid item xs={12}>
          <Charts 
            employees={data.employees}
            departments={data.departments}
            projects={data.projects}
            invoices={data.invoices}
            leaveRequests={data.leaveRequests}
          />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Projects
            </Typography>
            {data.projects.slice(0, 3).map((project) => (
              <Box key={project.id} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2">{project.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {project.status} | Budget: ${project.budget.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Leave Requests */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pending Leave Requests
            </Typography>
            {data.leaveRequests
              .filter(req => req.status === 'Pending')
              .slice(0, 3)
              .map((request) => {
                const employee = data.employees.find(emp => emp.id === request.employeeId);
                return (
                  <Box key={request.id} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2">
                      {employee?.name || 'Unknown Employee'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {request.leaveType} | {request.startDate} - {request.endDate}
                    </Typography>
                  </Box>
                );
              })}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
