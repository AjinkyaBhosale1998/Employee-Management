import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  AvatarGroup,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Assignment, MoreVert, CheckCircle, Cancel, HourglassEmpty } from '@mui/icons-material';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { getStatusColor, formatDate } from '../utils/helpers';
import ProjectForm from '../components/forms/ProjectForm';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Projects() {
  const { data, loading, addProject, updateProjectStatus } = useApi();
  const { hasPermission, userRole } = useAuth();
  const [openForm, setOpenForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAddProject = () => {
    setOpenForm(true);
  };

  const handleFormSubmit = async (projectData) => {
    const result = await addProject(projectData);
    setSnackbar({
      open: true,
      message: result.success ? 'Project proposal submitted successfully' : 'Failed to submit project',
      severity: result.success ? 'success' : 'error'
    });

    if (result.success) {
      setOpenForm(false);
    }
  };

  const handleMenuClick = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleStatusChange = (status) => {
    setConfirmAction({ project: selectedProject, status });
    handleMenuClose();
  };

  const confirmStatusChange = async () => {
    if (confirmAction) {
      const result = await updateProjectStatus(confirmAction.project.id, confirmAction.status);
      setSnackbar({
        open: true,
        message: result.success ? `Project ${confirmAction.status.toLowerCase()} successfully` : 'Failed to update project status',
        severity: result.success ? 'success' : 'error'
      });
      setConfirmAction(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle />;
      case 'Rejected': return <Cancel />;
      case 'Under Review': return <HourglassEmpty />;
      default: return <Assignment />;
    }
  };

  const canApprove = hasPermission('approve') && (userRole === 'Admin' || userRole === 'Manager');

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Project Proposals</Typography>
        {hasPermission('write') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddProject}
          >
            Submit Proposal
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {data.projects.map((project) => {
          const manager = data.employees.find(emp => emp.id === project.manager);

          return (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" noWrap>
                        {project.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manager: {manager?.name || 'Unknown'}
                      </Typography>
                    </Box>

                    {canApprove && project.status !== 'Approved' && project.status !== 'Rejected' && (
                      <IconButton onClick={(e) => handleMenuClick(e, project)}>
                        <MoreVert />
                      </IconButton>
                    )}
                  </Box>

                  <Box mb={2}>
                    <Chip
                      icon={getStatusIcon(project.status)}
                      label={project.status}
                      color={getStatusColor(project.status)}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Budget: ${project.budget.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Submitted: {formatDate(project.submissionDate)}
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Team Members:
                    </Typography>
                    <AvatarGroup max={4}>
                      {project.teamMembers.map((member, index) => {
                        const emp = data.employees.find(e => e.id === member.employee);
                        return (
                          <Avatar
                            key={index}
                            sx={{ width: 32, height: 32, fontSize: '0.8rem' }}
                            title={`${emp?.name || 'Unknown'} - ${member.role}`}
                          >
                            {emp?.name?.charAt(0) || '?'}
                          </Avatar>
                        );
                      })}
                    </AvatarGroup>
                  </Box>

                  <Box>
                    {project.teamMembers.map((member, index) => {
                      const emp = data.employees.find(e => e.id === member.employee);
                      return (
                        <Typography key={index} variant="body2" color="text.secondary">
                          • {emp?.name || 'Unknown Employee'} ({member.role})
                        </Typography>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('Under Review')}>
          <HourglassEmpty sx={{ mr: 1 }} />
          Under Review
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Approved')}>
          <CheckCircle sx={{ mr: 1 }} />
          Approve
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Rejected')}>
          <Cancel sx={{ mr: 1 }} />
          Reject
        </MenuItem>
      </Menu>

      {/* Project Form Dialog */}
      <ProjectForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        employees={data.employees}
      />

      {/* Confirm Status Change Dialog */}
      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={confirmStatusChange}
        title="Update Project Status"
        message={`Are you sure you want to ${confirmAction?.status?.toLowerCase()} this project?`}
        confirmText={confirmAction?.status}
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
