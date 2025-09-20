'use client';

import React from 'react';
import { useError, useErrorMonitoring } from '../contexts/ErrorContext';
import { getErrorActionText, WalletError } from '../utils/walletErrorHandler';

interface ErrorDisplayProps {
  showAllErrors?: boolean;
  maxVisible?: number;
  className?: string;
}

/**
 * Component pentru afișarea erorilor cu acțiuni
 */
export function ErrorDisplay({ 
  showAllErrors = false, 
  maxVisible = 3,
  className = ''
}: ErrorDisplayProps) {
  const { errorState, clearError, clearAllErrors, retryLastOperation } = useError();
  const { isHealthy } = useErrorMonitoring();

  if (isHealthy) {
    return null;
  }

  const errorsToShow = showAllErrors 
    ? errorState.errors 
    : errorState.errors.slice(0, maxVisible);

  return (
    <div className={`space-y-2 ${className}`}>
      {errorsToShow.map((error, index) => (
        <ErrorCard 
          key={`${error.code}-${index}`}
          error={error}
          onDismiss={() => clearError(error.code)}
          onRetry={error.action === 'retry' ? retryLastOperation : undefined}
        />
      ))}
      
      {errorState.errors.length > maxVisible && !showAllErrors && (
        <div className="text-center">
          <button
            onClick={clearAllErrors}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Șterge toate erorile ({errorState.errors.length})
          </button>
        </div>
      )}
    </div>
  );
}

interface ErrorCardProps {
  error: WalletError;
  onDismiss: () => void;
  onRetry?: () => void;
}

/**
 * Card individual pentru o eroare
 */
function ErrorCard({ error, onDismiss, onRetry }: ErrorCardProps) {
  const getSeverityStyles = (severity: WalletError['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-900/30 border-red-800 text-red-200';
      case 'high':
        return 'bg-red-900/20 border-red-700 text-red-300';
      case 'medium':
        return 'bg-yellow-900/20 border-yellow-700 text-yellow-300';
      case 'low':
        return 'bg-blue-900/20 border-blue-700 text-blue-300';
      default:
        return 'bg-gray-900/20 border-gray-700 text-gray-300';
    }
  };

  const getSeverityIcon = (severity: WalletError['severity']) => {
    switch (severity) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚡';
      case 'low':
        return 'ℹ️';
      default:
        return '❓';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getSeverityStyles(error.severity)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="text-lg">{getSeverityIcon(error.severity)}</span>
          <div className="flex-1">
            <p className="font-medium">{error.userMessage}</p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer opacity-70 hover:opacity-100">
                  Detalii tehnice
                </summary>
                <div className="mt-1 text-xs opacity-70">
                  <p><strong>Cod:</strong> {error.code}</p>
                  <p><strong>Mesaj:</strong> {error.message}</p>
                </div>
              </details>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
            >
              {getErrorActionText(error)}
            </button>
          )}
          <button
            onClick={onDismiss}
            className="text-white/50 hover:text-white/80 transition-colors"
            aria-label="Închide eroarea"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Status indicator pentru sănătatea aplicației
 */
export function ErrorStatusIndicator({ className = '' }: { className?: string }) {
  const { criticalErrors, hasNetworkErrors, hasWalletErrors, isHealthy } = useErrorMonitoring();
  
  if (isHealthy) {
    return (
      <div className={`flex items-center space-x-2 text-green-400 ${className}`}>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm">Conectat</span>
      </div>
    );
  }

  if (criticalErrors.length > 0) {
    return (
      <div className={`flex items-center space-x-2 text-red-400 ${className}`}>
        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
        <span className="text-sm">Erori critice ({criticalErrors.length})</span>
      </div>
    );
  }

  if (hasNetworkErrors) {
    return (
      <div className={`flex items-center space-x-2 text-yellow-400 ${className}`}>
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <span className="text-sm">Probleme de rețea</span>
      </div>
    );
  }

  if (hasWalletErrors) {
    return (
      <div className={`flex items-center space-x-2 text-orange-400 ${className}`}>
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <span className="text-sm">Probleme wallet</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 text-gray-400 ${className}`}>
      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      <span className="text-sm">Status necunoscut</span>
    </div>
  );
}

/**
 * Loading overlay pentru operațiuni
 */
export function LoadingOverlay() {
  const { errorState } = useError();
  
  if (!errorState.isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card-bg rounded-xl p-6 border border-gray-800 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-solana-purple border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white">Se procesează...</p>
      </div>
    </div>
  );
}