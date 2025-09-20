import toast from 'react-hot-toast';

export interface WalletError {
  code: string;
  message: string;
  userMessage: string;
  action?: 'retry' | 'reconnect' | 'refresh' | 'install';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const WalletErrorTypes = {
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  WALLET_NOT_FOUND: 'WALLET_NOT_FOUND',
  USER_REJECTED: 'USER_REJECTED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  WALLET_LOCKED: 'WALLET_LOCKED',
  UNSUPPORTED_METHOD: 'UNSUPPORTED_METHOD',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

export const getWalletErrorMessage = (error: any): WalletError => {
  // User rejected transaction or connection
  if (error.code === 4001 || error.message?.includes('User rejected') || error.message?.includes('user rejected')) {
    return {
      code: WalletErrorTypes.USER_REJECTED,
      message: error.message,
      userMessage: 'Conexiunea la wallet a fost refuzată. Aprobă tranzacția în wallet pentru a continua.',
      action: 'retry',
      severity: 'medium'
    };
  }

  // Wallet not found or not installed
  if (error.code === 4100 || error.message?.includes('wallet not found') || error.message?.includes('No provider')) {
    return {
      code: WalletErrorTypes.WALLET_NOT_FOUND,
      message: error.message,
      userMessage: 'Nu s-a găsit niciun wallet compatibil. Te rugăm să instalezi Phantom, Solflare sau alt wallet Solana.',
      action: 'install',
      severity: 'high'
    };
  }

  // Wallet is locked
  if (error.message?.includes('wallet is locked') || error.message?.includes('Wallet locked')) {
    return {
      code: WalletErrorTypes.WALLET_LOCKED,
      message: error.message,
      userMessage: 'Wallet-ul este blocat. Te rugăm să-l deblochezi și să încerci din nou.',
      action: 'retry',
      severity: 'medium'
    };
  }

  // Insufficient funds
  if (error.message?.includes('insufficient funds') || error.message?.includes('Insufficient SOL')) {
    return {
      code: WalletErrorTypes.INSUFFICIENT_FUNDS,
      message: error.message,
      userMessage: 'Fonduri insuficiente pentru această tranzacție. Verifică balanța SOL din wallet.',
      action: 'refresh',
      severity: 'high'
    };
  }

  // Network/Connection errors
  if (error.message?.includes('network') || error.message?.includes('fetch') || error.message?.includes('timeout')) {
    return {
      code: WalletErrorTypes.NETWORK_ERROR,
      message: error.message,
      userMessage: 'Problemă de conectivitate la rețeaua Solana. Verifică conexiunea la internet și încearcă din nou.',
      action: 'retry',
      severity: 'medium'
    };
  }

  // Unsupported method
  if (error.code === 4200 || error.message?.includes('Unsupported method') || error.message?.includes('not supported')) {
    return {
      code: WalletErrorTypes.UNSUPPORTED_METHOD,
      message: error.message,
      userMessage: 'Această operațiune nu este suportată de wallet-ul curent. Încearcă cu alt wallet.',
      action: 'reconnect',
      severity: 'high'
    };
  }

  // Transaction failed
  if (error.message?.includes('Transaction failed') || error.message?.includes('simulation failed')) {
    return {
      code: WalletErrorTypes.TRANSACTION_FAILED,
      message: error.message,
      userMessage: 'Tranzacția a eșuat. Verifică parametrii și încearcă din nou.',
      action: 'retry',
      severity: 'high'
    };
  }

  // Generic connection failed
  if (error.message?.includes('Failed to connect') || error.message?.includes('Connection failed')) {
    return {
      code: WalletErrorTypes.CONNECTION_FAILED,
      message: error.message,
      userMessage: 'Nu s-a putut conecta la wallet. Verifică dacă wallet-ul este disponibil și încearcă din nou.',
      action: 'retry',
      severity: 'medium'
    };
  }

  // Unknown error fallback
  return {
    code: WalletErrorTypes.UNKNOWN_ERROR,
    message: error.message || 'Unknown error occurred',
    userMessage: 'A apărut o eroare neașteptată. Te rugăm să încerci din nou sau să contactezi suportul.',
    action: 'retry',
    severity: 'medium'
  };
};

/**
 * Enhanced wallet error handler with user-friendly messages
 */
export const handleWalletError = (error: any, operation: string = 'Operațiunea wallet'): WalletError => {
  const walletError = getWalletErrorMessage(error);
  
  console.error(`${operation} failed:`, {
    code: walletError.code,
    originalMessage: error.message,
    userMessage: walletError.userMessage,
    severity: walletError.severity,
    timestamp: new Date().toISOString()
  });

  // Show toast notification based on severity
  const toastOptions = {
    duration: walletError.severity === 'critical' ? 8000 : 
              walletError.severity === 'high' ? 6000 : 4000,
    position: 'top-center' as const,
  };

  if (walletError.severity === 'critical' || walletError.severity === 'high') {
    toast.error(`${operation}: ${walletError.userMessage}`, toastOptions);
  } else {
    toast(`${operation}: ${walletError.userMessage}`, {
      ...toastOptions,
      icon: '⚠️',
    });
  }

  return walletError;
};

/**
 * Retry mechanism with exponential backoff for wallet operations
 */
export const retryWalletOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  operationName: string = 'Wallet operation'
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const walletError = getWalletErrorMessage(error);
      
      // Don't retry for certain error types
      if ([
        WalletErrorTypes.USER_REJECTED,
        WalletErrorTypes.WALLET_NOT_FOUND,
        WalletErrorTypes.UNSUPPORTED_METHOD
      ].includes(walletError.code as any)) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`${operationName} attempt ${attempt} failed, retrying in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Get user-friendly action button text based on error type
 */
export const getErrorActionText = (error: WalletError): string => {
  switch (error.action) {
    case 'retry':
      return 'Încearcă din nou';
    case 'reconnect':
      return 'Reconectează wallet-ul';
    case 'refresh':
      return 'Reîmprospătează';
    case 'install':
      return 'Instalează wallet';
    default:
      return 'OK';
  }
};