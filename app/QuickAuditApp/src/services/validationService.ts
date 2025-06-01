/**
 * Validation Service
 * Provides validation functions for form inputs
 */

export const validationService = {
  /**
   * Validate an email address
   * @param email Email address to validate
   * @returns Validation result
   */
  validateEmail: (email: string): { valid: boolean; message: string } => {
    const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
    
    if (!email) {
      return { valid: false, message: 'Email is required' };
    }
    
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Please enter a valid email address' };
    }
    
    return { valid: true, message: '' };
  },
  
  /**
   * Validate a password
   * @param password Password to validate
   * @returns Validation result
   */
  validatePassword: (password: string): { valid: boolean; message: string } => {
    if (!password) {
      return { valid: false, message: 'Password is required' };
    }
    
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    
    return { valid: true, message: '' };
  },
  
  /**
   * Validate a name
   * @param name Name to validate
   * @returns Validation result
   */
  validateName: (name: string): { valid: boolean; message: string } => {
    if (!name) {
      return { valid: false, message: 'Name is required' };
    }
    
    if (name.length < 2) {
      return { valid: false, message: 'Name must be at least 2 characters long' };
    }
    
    return { valid: true, message: '' };
  },
  
  /**
   * Validate a phone number
   * @param phone Phone number to validate
   * @returns Validation result
   */
  validatePhone: (phone: string): { valid: boolean; message: string } => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/;
    
    if (!phone) {
      return { valid: false, message: 'Phone number is required' };
    }
    
    if (!phoneRegex.test(phone)) {
      return { valid: false, message: 'Please enter a valid phone number' };
    }
    
    return { valid: true, message: '' };
  }
};
