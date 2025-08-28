import { useState, useEffect } from 'react';
import { 
  mockEmployees, 
  mockDepartments, 
  mockProjects, 
  mockInvoices, 
  mockLeaveRequests 
} from '../data/mockData';

export function useApi() {
  const [data, setData] = useState({
    employees: mockEmployees,
    departments: mockDepartments,
    projects: mockProjects,
    invoices: mockInvoices,
    leaveRequests: mockLeaveRequests
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const simulateDelay = (ms = 500) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };


  const addEmployee = async (employee) => {
    setLoading(true);
    await simulateDelay();

    try {
      setData(prev => ({
        ...prev,
        employees: [...prev.employees, employee]
      }));
      setLoading(false);
      return { success: true, data: employee };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const updateEmployee = async (id, updatedEmployee) => {
    setLoading(true);
    await simulateDelay();

    try {
      setData(prev => ({
        ...prev,
        employees: prev.employees.map(emp => 
          emp.id === id ? { ...emp, ...updatedEmployee } : emp
        )
      }));
      setLoading(false);
      return { success: true, data: updatedEmployee };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const deleteEmployee = async (id) => {
    setLoading(true);
    await simulateDelay();

    try {
      setData(prev => ({
        ...prev,
        employees: prev.employees.filter(emp => emp.id !== id)
      }));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const addDepartment = async (department) => {
    setLoading(true);
    await simulateDelay();

    try {
      const newDept = { ...department, id: Date.now() };
      setData(prev => ({
        ...prev,
        departments: [...prev.departments, newDept]
      }));
      setLoading(false);
      return { success: true, data: newDept };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const addProject = async (project) => {
    setLoading(true);
    await simulateDelay();

    try {
      const newProject = { ...project, id: Date.now() };
      setData(prev => ({
        ...prev,
        projects: [...prev.projects, newProject]
      }));

      console.log('Mock Email: New project proposal submitted:', project.name);

      setLoading(false);
      return { success: true, data: newProject };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const updateProjectStatus = async (id, status) => {
    setLoading(true);
    await simulateDelay();

    try {
      setData(prev => ({
        ...prev,
        projects: prev.projects.map(proj => 
          proj.id === id ? { ...proj, status } : proj
        )
      }));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const addLeaveRequest = async (leaveRequest) => {
    setLoading(true);
    await simulateDelay();

    try {
      const newRequest = { 
        ...leaveRequest, 
        id: Date.now(),
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0]
      };

      setData(prev => ({
        ...prev,
        leaveRequests: [...prev.leaveRequests, newRequest]
      }));

      console.log('Mock Email: Leave request submitted for employee:', leaveRequest.employeeId);

      setLoading(false);
      return { success: true, data: newRequest };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const addInvoice = async (invoice) => {
    setLoading(true);
    await simulateDelay();

    try {
      const newInvoice = { 
        ...invoice, 
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };

      setData(prev => ({
        ...prev,
        invoices: [...prev.invoices, newInvoice]
      }));

      console.log('Mock Email: Invoice generated for client:', invoice.clientName);

      setLoading(false);
      return { success: true, data: newInvoice };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  return {
    data,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addDepartment,
    addProject,
    updateProjectStatus,
    addLeaveRequest,
    addInvoice
  };
}
