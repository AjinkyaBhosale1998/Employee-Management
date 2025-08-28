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
import { generateInvoiceId } from '../../utils/helpers';
import { useInvoiceValidation } from '../../hooks/useValidation';

export default function InvoiceForm({ open, onClose, onSubmit, projects }) {
  const [formData, setFormData] = useState({
    clientName: '',
    amount: '',
    dueDate: null,
    project: ''
  });

  const { errors, validate, validateField, clearErrors } = useInvoiceValidation();

  useEffect(() => {
    if (!open) {
      setFormData({
        clientName: '',
        amount: '',
        dueDate: null,
        project: ''
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
    setFormData(prev => ({ ...prev, dueDate: date }));
    validateField('dueDate', date?.toDate(), { ...formData, dueDate: date?.toDate() });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate ? formData.dueDate.format('YYYY-MM-DD') : '',
      id: generateInvoiceId([])
    };

    const isValid = await validate(submitData);
    if (isValid) {
      onSubmit(submitData);
    }
  };

  const handleClose = () => {
    setFormData({
      clientName: '',
      amount: '',
      dueDate: null,
      project: ''
    });
    clearErrors();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generate New Invoice</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Client Name"
                value={formData.clientName}
                onChange={handleChange('clientName')}
                error={!!errors.clientName}
                helperText={errors.clientName}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={handleChange('amount')}
                error={!!errors.amount}
                helperText={errors.amount}
                InputProps={{
                  startAdornment: '$'
                }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Due Date *"
                value={formData.dueDate}
                onChange={handleDateChange}
                minDate={dayjs()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.dueDate}
                    helperText={errors.dueDate}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.project}>
                <InputLabel>Project *</InputLabel>
                <Select
                  value={formData.project}
                  label="Project *"
                  onChange={handleChange('project')}
                >
                  {projects.filter(p => p.status === 'Approved').map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name} (Budget: ${project.budget.toLocaleString()})
                    </MenuItem>
                  ))}
                </Select>
                {errors.project && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.project}
                  </Alert>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info">
                Invoice number will be auto-generated (INV001, INV002, etc.)
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Generate Invoice
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
