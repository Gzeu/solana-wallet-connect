'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { WalletError, WalletErrorTypes, handleWalletError } from '../utils/walletErrorHandler';

interface ErrorState {
  errors: WalletError[];
  isLoading: boolean;
  lastError: WalletError | null;
}

interface ErrorContextType {
  errorState: ErrorState;
  addError: (error: any, operation?: string) => WalletError;
  clearError: (errorCode: string) => void;
  clearAllErrors: () => void;
  retryLastOperation: () => void;
  setLoading: (loading: boolean) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
  maxErrors?: number;
}

export function ErrorProvider({ children, maxErrors = 5 }: ErrorProviderProps) {
  const [errorState, setErrorState] = useState<ErrorState>({
    errors: [],
    isLoading: false,
    lastError: null,
  });

  const [lastOperation, setLastOperation] = useState<(() => void) | null>(null);

  const addError = useCallback((error: any, operation: string = 'Operațiunea'): WalletError => {
    const walletError = handleWalletError(error, operation);
    
    setErrorState(prev => {
      const newErrors = [walletError, ...prev.errors].slice(0, maxErrors);
      return {
        ...prev,
        errors: newErrors,
        lastError: walletError,
      };
    });

    // Log critical errors for monitoring
    if (walletError.severity === 'critical') {
      console.error('CRITICAL ERROR:', {
        code: walletError.code,
        message: walletError.message,
        operation,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }

    return walletError;
  }, [maxErrors]);

  const clearError = useCallback((errorCode: string) => {
    setErrorState(prev => ({
      ...prev,
      errors: prev.errors.filter(error => error.code !== errorCode),
      lastError: prev.lastError?.code === errorCode ? null : prev.lastError,
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrorState(prev => ({
      ...prev,
      errors: [],
      lastError: null,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setErrorState(prev => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  const retryLastOperation = useCallback(() => {
    if (lastOperation) {
      clearAllErrors();
      setLoading(true);
      try {
        lastOperation();
      } catch (error) {
        addError(error, 'Reîncercare operațiune');
      } finally {
        setLoading(false);
      }
    }
  }, [lastOperation, clearAllErrors, setLoading, addError]);

  const contextValue: ErrorContextType = {
    errorState,
    addError,
    clearError,
    clearAllErrors,
    retryLastOperation,
    setLoading,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
}

/**
 * Hook pentru utilizarea Error Context
 */
export function useError(): ErrorContextType {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}

/**
 * Hook pentru operațiuni wallet cu error handling automat
 */
export function useWalletOperation() {
  const { addError, setLoading, clearAllErrors } = useError();

  const executeOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string = 'Operațiunea wallet',
    options?: {
      clearPreviousErrors?: boolean;
      showLoading?: boolean;
    }
  ): Promise<T | null> => {
    const { clearPreviousErrors = true, showLoading = true } = options || {};

    try {
      if (clearPreviousErrors) {
        clearAllErrors();
      }
      
      if (showLoading) {
        setLoading(true);
      }

      const result = await operation();
      return result;
    } catch (error) {
      addError(error, operationName);
      return null;
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [addError, setLoading, clearAllErrors]);

  return { executeOperation };
}

/**
 * Hook pentru monitorizarea erorilor critice
 */
export function useErrorMonitoring() {
  const { errorState } = useError();

  const criticalErrors = errorState.errors.filter(error => error.severity === 'critical');
  const hasNetworkErrors = errorState.errors.some(error => error.code === WalletErrorTypes.NETWORK_ERROR);
  const hasWalletErrors = errorState.errors.some(error => 
    [WalletErrorTypes.WALLET_NOT_FOUND, WalletErrorTypes.CONNECTION_FAILED].includes(error.code as any)
  );

  return {
    criticalErrors,
    hasNetworkErrors,
    hasWalletErrors,
    totalErrors: errorState.errors.length,
    isHealthy: errorState.errors.length === 0,
  };
}