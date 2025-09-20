export const SOLANA_NETWORK = 'devnet';
export const EXPLORER_URL = 'https://explorer.solana.com';

export const formatAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const formatBalance = (balance: number): string => {
  return balance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
};

export const getExplorerUrl = (signature: string): string => {
  return `${EXPLORER_URL}/tx/${signature}?cluster=${SOLANA_NETWORK}`;
};