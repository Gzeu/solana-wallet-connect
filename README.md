# SolanaWalletConnect 🚀

A complete Solana dApp built with Next.js, TypeScript, and Tailwind CSS that demonstrates wallet integration, balance checking, and SOL transactions.

## Features ✨

- 🔗 **Multi-Wallet Support**: Connect with Phantom, Solflare, and other popular Solana wallets
- 💰 **Real-time Balance**: View your SOL balance with automatic updates every 10 seconds
- ⚡ **Send Transactions**: Send SOL to any Solana address with transaction confirmation
- 🌐 **Network Status**: Live network information including block height and TPS
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS and custom Solana branding
- 🔐 **Secure**: Built with official Solana wallet adapters and Web3.js

## Tech Stack 🛠️

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom Solana theme
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **Notifications**: React Hot Toast
- **Deployment**: Vercel-ready configuration

## Quick Start 🏃‍♂️

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gzeu/solana-wallet-connect.git
   cd solana-wallet-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment on Vercel 🌍

This project is optimized for Vercel deployment:

1. **Push to GitHub**: Make sure your code is pushed to a GitHub repository
2. **Connect Vercel**: Import your repository on [vercel.com](https://vercel.com)
3. **Deploy**: Vercel will automatically detect Next.js and deploy your app

### Environment Setup

The app runs on Solana Devnet by default. To switch to Mainnet:

1. Update `SOLANA_NETWORK` in `utils/constants.ts`
2. Change network in `contexts/WalletContextProvider.tsx`

## Project Structure 📁

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── BalanceCard.tsx    # Wallet balance display
│   ├── NetworkStatus.tsx  # Network information
│   ├── SendSOLForm.tsx    # Transaction form
│   └── WalletButton.tsx   # Wallet connection
├── contexts/              # React contexts
│   └── WalletContextProvider.tsx
├── hooks/                 # Custom React hooks
│   ├── useBalance.ts      # Balance management
│   └── useSendTransaction.ts
└── utils/                 # Utility functions
    └── constants.ts       # App constants
```

## Features in Detail 🔍

### Wallet Integration
- Support for multiple Solana wallets (Phantom, Solflare, Torus)
- Automatic connection persistence
- Secure transaction signing

### Balance Tracking
- Real-time SOL balance updates
- Formatted display with proper decimals
- Loading states and error handling

### Transaction System
- Send SOL to any Solana address
- Transaction confirmation tracking
- Explorer link integration
- Form validation and error handling

### Network Monitoring
- Current block height display
- Transactions per second (TPS)
- Connection status indicator
- Automatic updates every 5 seconds

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

MIT License - feel free to use this project for learning and building your own Solana dApps.

## Support 💬

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ by George Pricop**

Connect with me:
- GitHub: [@Gzeu](https://github.com/Gzeu)
- Solana: Making Web3 accessible to everyone! 🌐