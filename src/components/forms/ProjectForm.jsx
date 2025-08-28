import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Alert
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useProjectValidation } from '../../hooks/useValidation';

export default function ProjectForm({ open, onClose, onSubmit, employees }) {
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    budget: '',
    submissionDate: null,
    teamMembers: [{ employee: '', role: '' }]
  });

  const { errors, validate, validateField, clearErrors } = useProjectValidation();

  useEffect(() => {
    if (!open) {
      setFormData({
        name: '',
        manager: '',
        budget: '',
        submissionDate: null,
        teamMembers: [{ employee: '', role: '' }]
      });
      clearErrors();
    }
  }, [open, clearErrors]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value, { ...formData, [field]: value });
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, submissionDate: date }));
    validateField('submissionDate', date?.toDate(), { ...formData, submissionDate: date?.toDate() });
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedTeamMembers = formData.teamMembers.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    );
    setFormData(prev => ({ ...prev, teamMembers: updatedTeamMembers }));
    validateField('teamMembers', updatedTeamMembers, { ...formData, teamMembers: updatedTeamMembers });
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { employee: '', role: '' }]
    }));
  };

  const removeTeamMember = (index) => {
    if (formData.teamMembers.length > 1) {
      const updatedTeamMembers = formData.teamMembers.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, teamMembers: updatedTeamMembers }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitData = {
      ...formData,
      budget: parseFloat(formData.budget),
      submissionDate: formData.submissionDate ? formData.submissionDate.format('YYYY-MM-DD') : '',
      status: 'Submitted'
    };

    const isValid = await validate(submitData);
    if (isValid) {
      onSubmit(submitData);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      manager: '',
      budget: '',
      submissionDate: null,
      teamMembers: [{ employee: '', role: '' }]
    });
    clearErrors();
    onClose();
  };

  const managers = employees.filter(emp => emp.role === 'Manager' || emp.role === 'Team Lead');

  const roleOptions = [
    'Lead Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Business Analyst', 'Data Analyst', 'QA Engineer', 'DevOps Engineer',
    'Designer', 'Product Manager', 'Scrum Master'
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Submit Project Proposal</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                value={formData.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.manager}>
                <InputLabel>Project Manager *</InputLabel>
                <Select
                  value={formData.manager}
                  label="Project Manager *"
                  onChange={handleChange('manager')}
                >
                  {managers.map(emp => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.id}) - {emp.department}
                    </MenuItem>
                  ))}
                </Select>
                {errors.manager && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.manager}
                  </Alert>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Budget"
                type="number"
                value={formData.budget}
                onChange={handleChange('budget')}
                error={!!errors.budget}
                helperText={errors.budget}
                InputProps={{
                  startAdornment: '$'
                }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Submission Date *"
                value={formData.submissionDate}
                onChange={handleDateChange}
                minDate={dayjs()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.submissionDate}
                    helperText={errors.submissionDate}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Team Members</Typography>
                <Button
                  startIcon={<Add />}
                  onClick={addTeamMember}
                  variant="outlined"
                  size="small"
                >
                  Add Member
                </Button>
              </Box>

              {formData.teamMembers.map((member, index) => (
                <Box key={index} mb={2}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <FormControl fullWidth>
                        <InputLabel>Employee</InputLabel>
                        <Select
                          value={member.employee}
                          label="Employee"
                          onChange={(e) => handleTeamMemberChange(index, 'employee', e.target.value)}
                        >
                          {employees.map(emp => (
                            <MenuItem key={emp.id} value={emp.id}>
                              {emp.name} ({emp.id})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                          value={member.role}
                          label="Role"
                          onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                        >
                          {roleOptions.map(role => (
                            <MenuItem key={role} value={role}>
                              {role}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <IconButton
                        onClick={() => removeTeamMember(index)}
                        disabled={formData.teamMembers.length === 1}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}

              {errors.teamMembers && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.teamMembers}
                </Alert>
              )}
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info">
                Once submitted, your project proposal will be reviewed by management and finance team.
                You will receive email notifications about the approval status.
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Submit Proposal
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
