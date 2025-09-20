import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WalletButton from '../WalletButton';

// Mock the wallet adapter UI component
jest.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletMultiButton: ({ className, children }: { className?: string; children?: React.ReactNode }) => (
    <button className={className} data-testid="wallet-multi-button">
      {children || 'Connect Wallet'}
    </button>
  ),
}));

describe('WalletButton', () => {
  it('renders without crashing', () => {
    render(<WalletButton />);
    const button = screen.getByTestId('wallet-multi-button');
    expect(button).toBeInTheDocument();
  });

  it('applies the correct CSS classes', () => {
    render(<WalletButton />);
    const button = screen.getByTestId('wallet-multi-button');
    
    expect(button).toHaveClass(
      '!bg-solana-purple',
      'hover:!bg-purple-700',
      '!rounded-lg',
      '!font-semibold',
      '!transition-all',
      '!duration-200',
      '!px-6',
      '!py-3'
    );
  });

  it('displays default wallet button text', () => {
    render(<WalletButton />);
    const button = screen.getByText('Connect Wallet');
    expect(button).toBeInTheDocument();
  });
});