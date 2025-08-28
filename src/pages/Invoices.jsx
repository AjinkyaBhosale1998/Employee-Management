import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, PictureAsPdf, Receipt } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { getStatusColor, formatDate } from '../utils/helpers';
import InvoiceForm from '../components/forms/InvoiceForm';

export default function Invoices() {
  const { data, loading, addInvoice } = useApi();
  const { hasPermission } = useAuth();
  const [openForm, setOpenForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAddInvoice = () => {
    setOpenForm(true);
  };

  const handleFormSubmit = async (invoiceData) => {
    const result = await addInvoice(invoiceData);
    setSnackbar({
      open: true,
      message: result.success ? 'Invoice generated successfully' : 'Failed to generate invoice',
      severity: result.success ? 'success' : 'error'
    });

    if (result.success) {
      setOpenForm(false);
    }
  };

  const handleGeneratePDF = (invoice) => {
    console.log('Generating PDF for invoice:', invoice.id);
    setSnackbar({
      open: true,
      message: `PDF generated for invoice ${invoice.id}`,
      severity: 'success'
    });
  };

  const columns = [
    { field: 'id', headerName: 'Invoice ID', width: 120 },
    { field: 'clientName', headerName: 'Client', width: 200 },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 130,
      renderCell: (params) => `$${params.value.toLocaleString()}`
    },
    { 
      field: 'dueDate', 
      headerName: 'Due Date', 
      width: 130,
      renderCell: (params) => formatDate(params.value)
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
        />
      )
    },
    {
      field: 'project',
      headerName: 'Project',
      width: 200,
      renderCell: (params) => {
        const project = data.projects.find(p => p.id === params.value);
        return project ? project.name : 'Unknown Project';
      }
    },
    { 
      field: 'generatedDate', 
      headerName: 'Generated', 
      width: 130,
      renderCell: (params) => formatDate(params.value)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleGeneratePDF(params.row)}
          title="Generate PDF"
        >
          <PictureAsPdf />
        </IconButton>
      )
    }
  ];

  const totals = {
    total: data.invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: data.invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0),
    pending: data.invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0),
    overdue: data.invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0)
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Invoices</Typography>
        {hasPermission('write') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddInvoice}
          >
            Generate Invoice
          </Button>
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Receipt sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">${totals.total.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Receipt sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6">${totals.paid.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Paid</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Receipt sx={{ mr: 2, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h6">${totals.pending.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Pending</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Receipt sx={{ mr: 2, color: 'error.main' }} />
                <Box>
                  <Typography variant="h6">${totals.overdue.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Overdue</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Grid */}
      <Card>
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={data.invoices}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            disableSelectionOnClick
            loading={loading}
          />
        </div>
      </Card>

      {/* Invoice Form Dialog */}
      <InvoiceForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        projects={data.projects}
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
