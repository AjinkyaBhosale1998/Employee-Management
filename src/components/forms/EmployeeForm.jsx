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
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { generateEmployeeId } from '../../utils/helpers';
import { useEmployeeValidation } from '../../hooks/useValidation';

export default function EmployeeForm({ open, onClose, onSubmit, employee, departments, employees }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    department: '',
    joiningDate: null,
    reportingManager: '',
    role: 'Employee',
    leaveBalance: 20
  });

  const { errors, validate, validateField, clearErrors } = useEmployeeValidation();

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        joiningDate: employee.joiningDate ? dayjs(employee.joiningDate) : null
      });
    } else {
      setFormData({
        name: '',
        email: '',
        contact: '',
        department: '',
        joiningDate: null,
        reportingManager: '',
        role: 'Employee',
        leaveBalance: 20
      });
    }
    clearErrors();
  }, [employee, open, clearErrors]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    validateField(field, value, { ...formData, [field]: value });
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, joiningDate: date }));
    validateField('joiningDate', date?.toDate(), { ...formData, joiningDate: date?.toDate() });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitData = {
      ...formData,
      joiningDate: formData.joiningDate ? formData.joiningDate.format('YYYY-MM-DD') : '',
      id: employee?.id || generateEmployeeId(employees)
    };

    const isValid = await validate(submitData);
    if (isValid) {
      onSubmit(submitData);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      contact: '',
      department: '',
      joiningDate: null,
      reportingManager: '',
      role: 'Employee',
      leaveBalance: 20
    });
    clearErrors();
    onClose();
  };

  const managers = employees.filter(emp => 
    emp.role === 'Manager' && emp.id !== employee?.id
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {employee ? 'Edit Employee' : 'Add New Employee'}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee Name"
                value={formData.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Number"
                value={formData.contact}
                onChange={handleChange('contact')}
                error={!!errors.contact}
                helperText={errors.contact}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.department}>
                <InputLabel>Department *</InputLabel>
                <Select
                  value={formData.department}
                  label="Department *"
                  onChange={handleChange('department')}
                >
                  {departments.map(dept => (
                    <MenuItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.department && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.department}
                  </Alert>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Joining Date *"
                value={formData.joiningDate}
                onChange={handleDateChange}
                maxDate={dayjs()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.joiningDate}
                    helperText={errors.joiningDate}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Reporting Manager</InputLabel>
                <Select
                  value={formData.reportingManager}
                  label="Reporting Manager"
                  onChange={handleChange('reportingManager')}
                >
                  <MenuItem value="">No Manager</MenuItem>
                  {managers.map(manager => (
                    <MenuItem key={manager.id} value={manager.id}>
                      {manager.name} ({manager.id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={handleChange('role')}
                >
                  <MenuItem value="Employee">Employee</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Team Lead">Team Lead</MenuItem>
                  <MenuItem value="Senior Developer">Senior Developer</MenuItem>
                  <MenuItem value="Developer">Developer</MenuItem>
                  <MenuItem value="Analyst">Analyst</MenuItem>
                  <MenuItem value="Executive">Executive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Leave Balance (Days)"
                type="number"
                value={formData.leaveBalance}
                onChange={handleChange('leaveBalance')}
                inputProps={{ min: 0, max: 30 }}
              />
            </Grid>

            {employee && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Employee ID: {employee.id}
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {employee ? 'Update' : 'Add'} Employee
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
