interface ValidationError {
  field: string;
  message: string;
}

class ValidationService {
  validateEmail(email: string): ValidationError | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return { field: 'email', message: 'Email is required' };
    }
    if (!emailRegex.test(email)) {
      return { field: 'email', message: 'Invalid email format' };
    }
    return null;
  }

  validatePassword(password: string): ValidationError | null {
    if (!password) {
      return { field: 'password', message: 'Password is required' };
    }
    if (password.length < 8) {
      return { field: 'password', message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return { field: 'password', message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { field: 'password', message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { field: 'password', message: 'Password must contain at least one number' };
    }
    return null;
  }

  validateAuditData(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!data.title) {
      errors.push({ field: 'title', message: 'Title is required' });
    }

    if (!data.location) {
      errors.push({ field: 'location', message: 'Location is required' });
    }

    if (!data.type) {
      errors.push({ field: 'type', message: 'Audit type is required' });
    }

    if (data.findings && !Array.isArray(data.findings)) {
      errors.push({ field: 'findings', message: 'Findings must be an array' });
    }

    if (data.photos && !Array.isArray(data.photos)) {
      errors.push({ field: 'photos', message: 'Photos must be an array' });
    }

    return errors;
  }

  validateFindingData(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!data.description) {
      errors.push({ field: 'description', message: 'Description is required' });
    }

    if (!data.severity) {
      errors.push({ field: 'severity', message: 'Severity is required' });
    } else if (!['low', 'medium', 'high'].includes(data.severity)) {
      errors.push({ field: 'severity', message: 'Invalid severity level' });
    }

    if (data.photos && !Array.isArray(data.photos)) {
      errors.push({ field: 'photos', message: 'Photos must be an array' });
    }

    return errors;
  }

  validateUserProfile(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!data.name) {
      errors.push({ field: 'name', message: 'Name is required' });
    }

    const emailError = this.validateEmail(data.email);
    if (emailError) {
      errors.push(emailError);
    }

    if (!data.organization) {
      errors.push({ field: 'organization', message: 'Organization is required' });
    }

    return errors;
  }
}

export const validationService = new ValidationService(); 