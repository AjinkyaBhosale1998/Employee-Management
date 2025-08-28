import { useState } from 'react';
import { 
  employeeValidationSchema,
  departmentValidationSchema, 
  projectValidationSchema,
  invoiceValidationSchema,
  leaveValidationSchema
} from '../utils/validation';

export function useValidation(schema) {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validate = async (data) => {
    try {
      await schema.validate(data, { abortEarly: false });
      setErrors({});
      setIsValid(true);
      return true;
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      setIsValid(false);
      return false;
    }
  };

  const validateField = async (fieldName, value, data) => {
    try {
      await schema.validateAt(fieldName, { ...data, [fieldName]: value });
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
      return true;
    } catch (err) {
      setErrors(prev => ({ ...prev, [fieldName]: err.message }));
      return false;
    }
  };

  const clearErrors = () => {
    setErrors({});
    setIsValid(false);
  };

  return {
    errors,
    isValid,
    validate,
    validateField,
    clearErrors
  };
}

export const useEmployeeValidation = () => useValidation(employeeValidationSchema);
export const useDepartmentValidation = () => useValidation(departmentValidationSchema);
export const useProjectValidation = () => useValidation(projectValidationSchema);
export const useInvoiceValidation = () => useValidation(invoiceValidationSchema);
export const useLeaveValidation = () => useValidation(leaveValidationSchema);
