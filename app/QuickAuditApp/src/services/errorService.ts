/**
 * Error Service
 * Handles error logging, reporting, and user-friendly error messages
 */

interface ErrorOptions {
  showUser?: boolean;
  reportToServer?: boolean;
  level?: ErrorLevel;
  context?: Record<string, any>;
}

enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: number;
  level: ErrorLevel;
  context?: Record<string, any>;
  deviceInfo?: Record<string, any>;
}

class ErrorService {
  private errorReports: ErrorReport[] = [];
  private maxStoredErrors: number = 50;
  
  /**
   * Handle an error
   * @param error Error object or message
   * @param options Error handling options
   */
  public handleError(error: Error | string, options: ErrorOptions = {}): void {
    const defaultOptions: ErrorOptions = {
      showUser: true,
      reportToServer: true,
      level: ErrorLevel.ERROR,
      context: {}
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;
    
    // Create error report
    const report: ErrorReport = {
      message: errorMessage,
      stack: errorStack,
      timestamp: Date.now(),
      level: mergedOptions.level!,
      context: mergedOptions.context
    };
    
    // Add to local storage
    this.storeErrorReport(report);
    
    // Log to console
    this.logErrorToConsole(report);
    
    // Report to server if enabled
    if (mergedOptions.reportToServer) {
      this.reportErrorToServer(report);
    }
    
    // Show to user if enabled
    if (mergedOptions.showUser) {
      this.showErrorToUser(report);
    }
  }
  
  /**
   * Store error report in local storage
   * @param report Error report to store
   */
  private storeErrorReport(report: ErrorReport): void {
    this.errorReports.push(report);
    
    // Limit the number of stored errors
    if (this.errorReports.length > this.maxStoredErrors) {
      this.errorReports.shift();
    }
  }
  
  /**
   * Log error to console
   * @param report Error report to log
   */
  private logErrorToConsole(report: ErrorReport): void {
    const { level, message, stack, context } = report;
    
    switch (level) {
      case ErrorLevel.INFO:
        console.info(`[INFO] ${message}`, { stack, context });
        break;
      case ErrorLevel.WARNING:
        console.warn(`[WARNING] ${message}`, { stack, context });
        break;
      case ErrorLevel.ERROR:
        console.error(`[ERROR] ${message}`, { stack, context });
        break;
      case ErrorLevel.CRITICAL:
        console.error(`[CRITICAL] ${message}`, { stack, context });
        break;
    }
  }
  
  /**
   * Report error to server
   * @param report Error report to send
   */
  private async reportErrorToServer(report: ErrorReport): Promise<void> {
    // This would be implemented with actual API calls in a real app
    // For now, just log that we would report it
    console.log(`Would report error to server: ${report.message}`);
  }
  
  /**
   * Show error to user
   * @param report Error report to show
   */
  private showErrorToUser(report: ErrorReport): void {
    // This would be implemented with actual UI alerts in a real app
    // For now, just log that we would show it
    console.log(`Would show error to user: ${report.message}`);
  }
  
  /**
   * Get all stored error reports
   * @returns Array of error reports
   */
  public getErrorReports(): ErrorReport[] {
    return [...this.errorReports];
  }
  
  /**
   * Clear all stored error reports
   */
  public clearErrorReports(): void {
    this.errorReports = [];
  }
}

export default new ErrorService();