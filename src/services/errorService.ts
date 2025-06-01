import { Alert } from 'react-native';

interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

class ErrorService {
  private isNetworkError(error: any): boolean {
    return error.message === 'Network Error' || !error.response;
  }

  private isAuthError(error: any): boolean {
    return error.response?.status === 401 || error.response?.status === 403;
  }

  private isValidationError(error: any): boolean {
    return error.response?.status === 422;
  }

  private isServerError(error: any): boolean {
    return error.response?.status >= 500;
  }

  private getErrorMessage(error: any): string {
    if (this.isNetworkError(error)) {
      return 'Network connection error. Please check your internet connection and try again.';
    }

    if (this.isAuthError(error)) {
      return 'Authentication error. Please log in again.';
    }

    if (this.isValidationError(error)) {
      const validationErrors = error.response?.data?.errors;
      if (validationErrors && Array.isArray(validationErrors)) {
        return validationErrors.map((err: any) => err.message).join('\n');
      }
      return 'Validation error. Please check your input.';
    }

    if (this.isServerError(error)) {
      return 'Server error. Please try again later.';
    }

    return error.response?.data?.message || error.message || 'An unexpected error occurred.';
  }

  handleError(error: any, showAlert = true): ErrorResponse {
    const errorMessage = this.getErrorMessage(error);
    
    if (showAlert) {
      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    }

    return {
      message: errorMessage,
      code: error.response?.status?.toString(),
      details: error.response?.data
    };
  }

  handleValidationErrors(errors: { field: string; message: string }[]): void {
    const errorMessage = errors.map(error => `${error.field}: ${error.message}`).join('\n');
    Alert.alert(
      'Validation Error',
      errorMessage,
      [{ text: 'OK' }]
    );
  }

  handleSuccess(message: string): void {
    Alert.alert(
      'Success',
      message,
      [{ text: 'OK' }]
    );
  }

  handleConfirmation(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ): void {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: onCancel
        },
        {
          text: 'OK',
          onPress: onConfirm
        }
      ]
    );
  }
}

export const errorService = new ErrorService(); 