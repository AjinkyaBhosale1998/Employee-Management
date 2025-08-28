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
  Alert,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { LEAVE_TYPES } from '../../utils/constants';
import { calculateLeaveDays } from '../../utils/helpers';
import { useLeaveValidation } from '../../hooks/useValidation';

export default function LeaveRequestForm({ open, onClose, onSubmit, employees }) {
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: '',
    startDate: null,
    endDate: null,
    reason: ''
  });

  const { errors, validate, validateField, clearErrors } = useLeaveValidation();

  useEffect(() => {
    if (!open) {
      setFormData({
        employeeId: '',
        leaveType: '',
        startDate: null,
        endDate: null,
        reason: ''
      });
      clearErrors();
    }
  }, [open, clearErrors]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value, { ...formData, [field]: value });
  };

  const handleDateChange = (field) => (date) => {
    setFormData(prev => ({ ...prev, [field]: date }));
    validateField(field, date?.toDate(), { ...formData, [field]: date?.toDate() });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitData = {
      ...formData,
      startDate: formData.startDate ? formData.startDate.format('YYYY-MM-DD') : '',
      endDate: formData.endDate ? formData.endDate.format('YYYY-MM-DD') : ''
    };

    const isValid = await validate(submitData);
    if (isValid) {
      onSubmit(submitData);
    }
  };

  const handleClose = () => {
    setFormData({
      employeeId: '',
      leaveType: '',
      startDate: null,
      endDate: null,
      reason: ''
    });
    clearErrors();
    onClose();
  };

  const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
  const leaveDays = formData.startDate && formData.endDate ? 
    calculateLeaveDays(formData.startDate.format('YYYY-MM-DD'), formData.endDate.format('YYYY-MM-DD')) : 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Submit Leave Request</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.employeeId}>
                <InputLabel>Employee *</InputLabel>
                <Select
                  value={formData.employeeId}
                  label="Employee *"
                  onChange={handleChange('employeeId')}
                >
                  {employees.map(emp => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.id}) - {emp.department}
                    </MenuItem>
                  ))}
                </Select>
                {errors.employeeId && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.employeeId}
                  </Alert>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.leaveType}>
                <InputLabel>Leave Type *</InputLabel>
                <Select
                  value={formData.leaveType}
                  label="Leave Type *"
                  onChange={handleChange('leaveType')}
                >
                  {LEAVE_TYPES.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.leaveType && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.leaveType}
                  </Alert>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date *"
                value={formData.startDate}
                onChange={handleDateChange('startDate')}
                minDate={dayjs()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date *"
                value={formData.endDate}
                onChange={handleDateChange('endDate')}
                minDate={formData.startDate || dayjs()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.endDate}
                    helperText={errors.endDate}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                multiline
                rows={3}
                value={formData.reason}
                onChange={handleChange('reason')}
                error={!!errors.reason}
                helperText={errors.reason}
                placeholder="Please provide a reason for your leave request..."
                required
              />
            </Grid>

            {selectedEmployee && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Leave Information:
                  </Typography>
                  <Typography variant="body2">
                    • Current Leave Balance: {selectedEmployee.leaveBalance} days
                  </Typography>
                  {leaveDays > 0 && (
                    <Typography variant="body2">
                      • Requested Duration: {leaveDays} days
                    </Typography>
                  )}
                  {leaveDays > selectedEmployee.leaveBalance && (
                    <Typography variant="body2" color="error">
                      • Warning: Insufficient leave balance
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Alert severity="info">
                Your leave request will be sent to your reporting manager for approval.
                You will receive an email notification once the request is processed.
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>


        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={leaveDays > (selectedEmployee?.leaveBalance || 0)}
          >
            Submit Request
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
