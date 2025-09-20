'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletButton() {
  return (
    <WalletMultiButton className="!bg-solana-purple hover:!bg-purple-700 !rounded-lg !font-semibold !transition-all !duration-200 !px-6 !py-3" />
  );
}