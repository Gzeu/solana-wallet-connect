import toast from 'react-hot-toast';

export interface WalletError extends Error {
  code?: string | number;
  logs?: string[];
}

export interface TransactionError extends Error {
  transactionSignature?: string;
  logs?: string[];
}

/**
 * Enhanced error handler for wallet operations
 */
export const handleWalletError = (error: unknown, operation: string = 'Wallet operation') => {
  console.error(`${operation} failed:`, error);
  
  let errorMessage = 'An unexpected error occurred';
  
  if (error instanceof Error) {
    const walletError = error as WalletError;
    
    // Handle specific wallet error codes
    switch (walletError.code) {
      case 4001:
      case -32603:
        errorMessage = 'Transaction was rejected by user';
        break;
      case 4100:
        errorMessage = 'Wallet is not connected';
        break;
      case 4200:
        errorMessage = 'Wallet does not support this operation';
        break;
      default:
        errorMessage = walletError.message || errorMessage;
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  toast.error(`${operation}: ${errorMessage}`, {
    duration: 5000,
    position: 'top-center',
  });
  
  return { error, message: errorMessage };
};

/**
 * Enhanced error handler for transaction operations
 */
export const handleTransactionError = (error: unknown, signature?: string) => {
  console.error('Transaction failed:', error, { signature });
  
  let errorMessage = 'Transaction failed';
  
  if (error instanceof Error) {
    const txError = error as TransactionError;
    
    // Common Solana transaction errors
    if (txError.message.includes('insufficient funds')) {
      errorMessage = 'Insufficient SOL balance for this transaction';
    } else if (txError.message.includes('blockhash not found')) {
      errorMessage = 'Transaction expired, please try again';
    } else if (txError.message.includes('Transaction too large')) {
      errorMessage = 'Transaction size exceeds limit';
    } else if (txError.message.includes('already processed')) {
      errorMessage = 'Transaction already processed';
    } else {
      errorMessage = txError.message;
    }
  }
  
  toast.error(errorMessage, {
    duration: 6000,
    position: 'top-center',
  });
  
  return { error, message: errorMessage, signature };
};

/**
 * Enhanced error handler for network operations
 */
export const handleNetworkError = (error: unknown, operation: string = 'Network operation') => {
  console.error(`${operation} failed:`, error);
  
  let errorMessage = 'Network error occurred';
  
  if (error instanceof Error) {
    if (error.message.includes('fetch')) {
      errorMessage = 'Unable to connect to Solana network';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Network request timed out';
    } else {
      errorMessage = error.message;
    }
  }
  
  toast.error(`${operation}: ${errorMessage}`, {
    duration: 4000,
    position: 'top-center',
  });
  
  return { error, message: errorMessage };
};

/**
 * Success handler for operations
 */
export const handleSuccess = (message: string, signature?: string) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-center',
  });
  
  if (signature) {
    console.log('Transaction successful:', signature);
  }
};

/**
 * Retry mechanism for failed operations
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }
  
  throw lastError;
};