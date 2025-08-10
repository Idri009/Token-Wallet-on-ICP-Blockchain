# DLTK Ledger Frontend

A modern, beautiful frontend for the ICRC1 ledger canister built with React, Vite, and SCSS.

## Features

- 🔐 **Wallet Connection**: Connect to Internet Computer using Internet Identity
- 💰 **Balance Display**: View your DLTK token balance in real-time
- 📤 **Token Transfer**: Send DLTK tokens to other users
- 📊 **Transaction History**: View your transaction history
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 📱 **Mobile Responsive**: Works perfectly on all device sizes

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: SCSS with modern CSS features
- **Icons**: Lucide React
- **Blockchain**: Internet Computer (ICRC1 standard)
- **Authentication**: Internet Identity

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Internet Computer dfx CLI
- Deployed ICRC1 ledger canister

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install additional packages**:
   ```bash
   npm install @dfinity/agent @dfinity/auth-client @dfinity/identity @dfinity/principal lucide-react
   ```

## Configuration

The frontend is configured to work with your deployed ICRC1 ledger canister:

- **Canister ID**: `mxzaz-hqaaa-aaaar-qaada-cai`
- **Network**: Local development (127.0.0.1:4943) or mainnet (ic0.app)

## Development

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Build for production**:
   ```bash
   npm run build
   ```

3. **Preview production build**:
   ```bash
   npm run preview
   ```

## Usage

### Connecting Your Wallet

1. Click "Connect Wallet" button
2. Choose your Internet Identity provider
3. Authenticate with your device or passphrase
4. Your wallet is now connected!

### Viewing Balance

- Your current DLTK balance is displayed prominently at the top
- Click the refresh button to update your balance
- Balance is automatically formatted with proper decimals

### Sending Tokens

1. Navigate to the "Transfer" tab
2. Enter the recipient's Principal ID
3. Enter the amount of DLTK to send
4. Click "Send DLTK"
5. Confirm the transaction

### Transaction History

- View all your incoming and outgoing transactions
- Transactions are color-coded (green for received, blue for sent)
- Each transaction shows amount, counterparty, and timestamp

## Project Structure

```
src/
├── App.jsx                 # Main application component
├── App.scss               # Main stylesheet
├── main.jsx               # Application entry point
├── services/
│   └── icrc1Service.js    # ICRC1 ledger interaction service
└── ...
```

## ICRC1 Service

The `icrc1Service.js` file handles all blockchain interactions:

- **Balance Queries**: Get account balances
- **Token Transfers**: Send tokens to other accounts
- **Metadata**: Retrieve token information
- **Error Handling**: Proper error handling and user feedback

## Customization

### Colors and Theme

Edit `App.scss` to customize:
- Primary colors
- Background colors
- Text colors
- Border styles
- Shadow effects

### Token Configuration

Update the following in `App.jsx`:
- Token symbol (DLTK)
- Token name (Dev Liftoff Token)
- Decimal places (currently 8)
- Canister ID

## Troubleshooting

### Common Issues

1. **Wallet Connection Fails**:
   - Ensure Internet Identity is accessible
   - Check network connectivity
   - Verify dfx is running locally

2. **Transfer Fails**:
   - Verify recipient Principal ID is correct
   - Ensure sufficient balance
   - Check network fees

3. **Balance Not Updating**:
   - Click refresh button
   - Check console for errors
   - Verify canister is responding

### Debug Mode

Enable debug logging by checking the browser console for detailed error messages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- Check the troubleshooting section
- Review the console logs
- Open an issue in the repository

---

**Built with ❤️ for the Internet Computer ecosystem**
