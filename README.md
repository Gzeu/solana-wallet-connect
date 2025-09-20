# SolanaWalletConnect 🚀

A complete Solana dApp built with Next.js, TypeScript, and Tailwind CSS that demonstrates wallet integration, balance checking, and SOL transactions with **comprehensive error handling** and **testing infrastructure**.

## Features ✨

- 🔗 **Multi-Wallet Support**: Connect with Phantom, Solflare, and other popular Solana wallets
- 💰 **Real-time Balance**: View your SOL balance with automatic updates every 10 seconds
- ⚡ **Send Transactions**: Send SOL to any Solana address with transaction confirmation
- 🌐 **Network Status**: Live network information including block height and TPS
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS and custom Solana branding
- 🔐 **Secure**: Built with official Solana wallet adapters and Web3.js
- 🛡️ **Error Handling**: Comprehensive error handling with Romanian user messages
- 🧪 **Testing**: Complete test suite with Jest and React Testing Library
- ⚡ **CI/CD**: Automated testing pipeline with GitHub Actions

## Tech Stack 🛠️

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom Solana theme
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **Notifications**: React Hot Toast with enhanced error handling
- **Testing**: Jest, React Testing Library, GitHub Actions CI/CD
- **Error Handling**: Custom error context with retry mechanisms
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

## Development Commands 🔧

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Testing Infrastructure 🧪

Comprehensive testing setup with:

- **Jest Configuration**: Optimized for Next.js with 80% coverage threshold
- **React Testing Library**: Component testing with user-centric approach
- **Solana Mocks**: Complete mocking of Solana Web3.js and wallet adapters
- **CI/CD Pipeline**: Automated testing on Node.js 18.x and 20.x
- **Coverage Reporting**: Integrated with Codecov

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Error Handling System 🛡️

### Romanian User Messages
All error messages are displayed in Romanian for better user experience:

- **Wallet Errors**: Connection failures, wallet not found, user rejections
- **Transaction Errors**: Insufficient funds, network issues, transaction failures
- **Network Errors**: Connectivity problems, timeouts
- **Form Validation**: Input validation with helpful hints

### Error Components

- **ErrorBoundary**: Catches React errors with retry functionality
- **ErrorContext**: Global error state management
- **ErrorDisplay**: User-friendly error cards with actions
- **ErrorStatusIndicator**: Real-time app health monitoring

### Retry Mechanisms

- **Smart Retry Logic**: Avoids retrying user rejections
- **Exponential Backoff**: Intelligent retry timing
- **Operation-Specific Handling**: Different strategies for different error types

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
├── app/                      # Next.js app directory
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with error handling
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── BalanceCard.tsx      # Wallet balance display
│   ├── ErrorBoundary.tsx    # React error boundary
│   ├── ErrorDisplay.tsx     # Error UI components
│   ├── NetworkStatus.tsx    # Network information
│   ├── SendSOLForm.tsx      # Transaction form
│   ├── WalletButton.tsx     # Wallet connection
│   └── __tests__/           # Component tests
│       ├── BalanceCard.test.tsx
│       └── WalletButton.test.tsx
├── contexts/                # React contexts
│   ├── ErrorContext.tsx     # Error state management
│   └── WalletContextProvider.tsx
├── hooks/                   # Custom React hooks
│   ├── useBalance.ts        # Balance management
│   └── useSendTransaction.ts
├── utils/                   # Utility functions
│   ├── constants.ts         # App constants
│   ├── errorHandler.ts      # Basic error utilities
│   └── walletErrorHandler.ts # Enhanced wallet errors
├── .github/
│   └── workflows/
│       └── test.yml         # CI/CD pipeline
├── jest.config.js           # Jest configuration
└── jest.setup.js            # Test setup with mocks
```

## Features in Detail 🔍

### Wallet Integration
- Support for multiple Solana wallets (Phantom, Solflare, Torus)
- Automatic connection persistence
- Secure transaction signing
- **Enhanced error handling** with user-friendly Romanian messages

### Balance Tracking
- Real-time SOL balance updates
- Formatted display with proper decimals
- Loading states and comprehensive error handling
- **Retry mechanisms** for failed balance fetches

### Transaction System
- Send SOL to any Solana address
- **Form validation** with Romanian error messages
- Transaction confirmation tracking
- Explorer link integration
- **Smart error handling** for all transaction states

### Network Monitoring
- Current block height display
- Transactions per second (TPS)
- Connection status indicator
- Automatic updates every 5 seconds
- **Network error detection** and recovery

### Error Management
- **Global Error Context**: Centralized error state management
- **Smart Retry Logic**: Automatic retry with exponential backoff
- **Severity-based Handling**: Critical, high, medium, low error levels
- **User-friendly Messages**: All errors translated to Romanian
- **Developer Tools**: Detailed error logging in development mode

## Error Handling Examples 💡

```typescript
// Using the error context in components
import { useWalletOperation } from '../contexts/ErrorContext';

const { executeOperation } = useWalletOperation();

// Automatic error handling for wallet operations
const result = await executeOperation(
  () => sendTransaction(recipient, amount),
  'Trimitere SOL',
  { clearPreviousErrors: true }
);
```

## Testing Philosophy 🎯

- **Component Testing**: Every component has comprehensive tests
- **Hook Testing**: Custom hooks are tested with mocks
- **Error Testing**: All error scenarios are covered
- **Integration Testing**: End-to-end workflows are validated
- **Coverage Goals**: 80%+ code coverage maintained

## Contributing 🤝

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch
3. **Add tests** for new functionality
4. **Ensure** all tests pass: `npm test`
5. **Submit** a Pull Request

### Development Workflow

```bash
# Install dependencies
npm install

# Run tests before development
npm run test

# Start development with hot reload
npm run dev

# Run tests in watch mode
npm run test:watch
```

## Performance Optimization ⚡

- **Error Context Optimization**: Limited error storage (max 5 errors)
- **Smart Retry Logic**: Prevents unnecessary retries
- **Loading State Management**: Centralized loading indicators
- **Memory Management**: Automatic error cleanup

## Security Considerations 🔒

- **Input Validation**: All user inputs are validated
- **Error Logging**: Sensitive data is never logged
- **Wallet Security**: Uses official Solana wallet adapters
- **Network Security**: Proper error handling for network issues

## Roadmap 🗺️

- [ ] **Mobile Optimization**: Enhanced mobile wallet support
- [ ] **SPL Token Support**: Multi-token functionality
- [ ] **Transaction History**: Historical transaction viewing
- [ ] **Dark/Light Theme**: Theme toggle functionality
- [ ] **Advanced Analytics**: Transaction insights

## License 📄

MIT License - feel free to use this project for learning and building your own Solana dApps.

## Support 💬

If you have any questions or need help:

- **GitHub Issues**: [Create an issue](https://github.com/Gzeu/solana-wallet-connect/issues)
- **Discussions**: Join the conversation in GitHub Discussions
- **Email**: Contact for urgent matters

---

**Built with ❤️ by George Pricop**

*Making Solana development accessible with Romanian-first error handling!* 🇷🇴

Connect with me:
- GitHub: [@Gzeu](https://github.com/Gzeu)
- Solana: Building the future of Web3! 🌐