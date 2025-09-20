import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import WalletContextProvider from '../contexts/WalletContextProvider';
import { ErrorProvider } from '../contexts/ErrorContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { ErrorDisplay, ErrorStatusIndicator, LoadingOverlay } from '../components/ErrorDisplay';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SolanaWalletConnect - Solana dApp',
  description: 'Connect your Solana wallet, view balance, and send SOL transactions',
  keywords: 'solana, wallet, phantom, dapp, blockchain, web3',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-bg min-h-screen`}>
        <ErrorProvider>
          <ErrorBoundary>
            <WalletContextProvider>
              {/* Error Status Indicator */}
              <div className="fixed top-4 right-4 z-40">
                <ErrorStatusIndicator />
              </div>
              
              {/* Global Error Display */}
              <div className="fixed top-16 right-4 z-30 max-w-md">
                <ErrorDisplay maxVisible={2} />
              </div>
              
              {/* Main App Content */}
              {children}
              
              {/* Loading Overlay */}
              <LoadingOverlay />
              
              {/* Toast Notifications */}
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1A1A1A',
                    color: '#fff',
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    fontSize: '14px',
                    maxWidth: '400px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />
            </WalletContextProvider>
          </ErrorBoundary>
        </ErrorProvider>
      </body>
    </html>
  );
}