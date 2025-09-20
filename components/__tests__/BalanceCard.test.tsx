import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BalanceCard from '../BalanceCard';
import { PublicKey } from '@solana/web3.js';

// Mock the custom hooks
jest.mock('../hooks/useBalance', () => ({
  useBalance: jest.fn(),
}));

jest.mock('../utils/constants', () => ({
  formatBalance: jest.fn((balance) => balance?.toFixed(4) || '0.0000'),
  formatAddress: jest.fn((address) => `${address.slice(0, 4)}...${address.slice(-4)}`),
}));

// Mock wallet adapter
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

const mockUseWallet = require('@solana/wallet-adapter-react').useWallet;
const mockUseBalance = require('../hooks/useBalance').useBalance;

describe('BalanceCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows connect message when wallet is not connected', () => {
    mockUseWallet.mockReturnValue({
      publicKey: null,
      connected: false,
    });
    
    mockUseBalance.mockReturnValue({
      balance: null,
      loading: false,
    });

    render(<BalanceCard />);
    
    expect(screen.getByText('Wallet Balance')).toBeInTheDocument();
    expect(screen.getByText('Connect your wallet to view balance')).toBeInTheDocument();
  });

  it('displays wallet info when connected', () => {
    const mockPublicKey = new PublicKey('11111111111111111111111111111112');
    
    mockUseWallet.mockReturnValue({
      publicKey: mockPublicKey,
      connected: true,
    });
    
    mockUseBalance.mockReturnValue({
      balance: 1.5,
      loading: false,
    });

    render(<BalanceCard />);
    
    expect(screen.getByText('Address:')).toBeInTheDocument();
    expect(screen.getByText('Balance:')).toBeInTheDocument();
    expect(screen.getByText('1.5000 SOL')).toBeInTheDocument();
  });

  it('shows loading state when balance is loading', () => {
    const mockPublicKey = new PublicKey('11111111111111111111111111111112');
    
    mockUseWallet.mockReturnValue({
      publicKey: mockPublicKey,
      connected: true,
    });
    
    mockUseBalance.mockReturnValue({
      balance: null,
      loading: true,
    });

    render(<BalanceCard />);
    
    const loadingElement = screen.getByRole('generic', { name: /loading/i }) || 
                           document.querySelector('.animate-pulse');
    expect(loadingElement).toBeInTheDocument();
  });

  it('shows error state when balance is null and not loading', () => {
    const mockPublicKey = new PublicKey('11111111111111111111111111111112');
    
    mockUseWallet.mockReturnValue({
      publicKey: mockPublicKey,
      connected: true,
    });
    
    mockUseBalance.mockReturnValue({
      balance: null,
      loading: false,
    });

    render(<BalanceCard />);
    
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('displays network info', () => {
    const mockPublicKey = new PublicKey('11111111111111111111111111111112');
    
    mockUseWallet.mockReturnValue({
      publicKey: mockPublicKey,
      connected: true,
    });
    
    mockUseBalance.mockReturnValue({
      balance: 1.5,
      loading: false,
    });

    render(<BalanceCard />);
    
    expect(screen.getByText('Connected to Solana Devnet • Balance updates every 10s')).toBeInTheDocument();
  });
});