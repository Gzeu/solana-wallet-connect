import '@testing-library/jest-dom';

// Mock Solana Web3.js for testing
jest.mock('@solana/web3.js', () => {
  const actualSolana = jest.requireActual('@solana/web3.js');
  return {
    ...actualSolana,
    Connection: jest.fn(() => ({
      getBalance: jest.fn(),
      getAccountInfo: jest.fn(),
      sendTransaction: jest.fn(),
      confirmTransaction: jest.fn(),
    })),
    PublicKey: actualSolana.PublicKey,
    LAMPORTS_PER_SOL: actualSolana.LAMPORTS_PER_SOL,
    SystemProgram: actualSolana.SystemProgram,
    Transaction: actualSolana.Transaction,
  };
});

// Mock wallet adapters
jest.mock('@solana/wallet-adapter-react', () => {
  return {
    useConnection: () => ({
      connection: {
        getBalance: jest.fn(),
        sendTransaction: jest.fn(),
      }
    }),
    useWallet: () => ({
      wallet: null,
      connect: jest.fn(),
      disconnect: jest.fn(),
      connecting: false,
      connected: false,
      disconnecting: false,
      publicKey: null,
      sendTransaction: jest.fn(),
    }),
  };
});

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}));

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});