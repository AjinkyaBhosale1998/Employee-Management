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
import { useDepartmentValidation } from '../../hooks/useValidation';

export default function DepartmentForm({ open, onClose, onSubmit, employees }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    head: ''
  });

  const { errors, validate, validateField, clearErrors } = useDepartmentValidation();

  useEffect(() => {
    if (!open) {
      setFormData({ name: '', location: '', head: '' });
      clearErrors();
    }
  }, [open, clearErrors]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value, { ...formData, [field]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = await validate(formData);
    if (isValid) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', location: '', head: '' });
    clearErrors();
    onClose();
  };

  const potentialHeads = employees.filter(emp => emp.role === 'Manager');

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Department</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Department Name"
                value={formData.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={handleChange('location')}
                error={!!errors.location}
                helperText={errors.location}
                placeholder="e.g., Building A, Floor 2"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.head}>
                <InputLabel>Department Head *</InputLabel>
                <Select
                  value={formData.head}
                  label="Department Head *"
                  onChange={handleChange('head')}
                >
                  {potentialHeads.map(emp => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.id}) - {emp.department}
                    </MenuItem>
                  ))}
                </Select>
                {errors.head && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.head}
                  </Alert>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info">
                Only employees with "Manager" role can be assigned as department heads.
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Add Department
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
