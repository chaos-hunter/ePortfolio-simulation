# ProInvestor Stock Simulation

ProInvestor is a real-time stock simulation and wealth projection web application. It allows users to track real-time stock prices, simulate paper trading with a virtual wallet, and project future investment growth based on historical data.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)

## 🚀 Features

### 1. Real-Time Stock Dashboard
- Search for any stock symbol (e.g., AAPL, NVDA, TSLA).
- View real-time prices and daily percentage changes.
- Data provided by `yahoo-finance2`.

### 2. Paper Trading Simulator
- **Virtual Wallet**: Start with $0 and deposit funds as needed.
- **Buy & Sell**: Execute buy orders and partial sell orders.
- **Portfolio Tracking**: Track your holdings, total asset value, and available cash.
- **Persistence**: Your simulation data is saved to your **Session Storage** (resets when you close the tab).

### 3. Investment Projection Engine
- **Growth Calculator**: Visualize how your investment could grow over time.
- **Smart Auto-Fill**: If you own a stock, the calculator uses your current holding value as the initial investment.
- **Interactive Charts**: Powered by `recharts` to show compound growth scenarios.

## 🛠️ Technology Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend**: React, standardized Vanilla CSS (Glassmorphism Design)
- **Visualization**: `recharts` for projection graphs
- **Data Fetching**: `yahoo-finance2` API
- **State Management**: React Hooks + Session Storage

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/stock-simulation.git
    cd stock-simulation
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure
- `src/app`: Main application routes and page logic.
- `src/app/api`: Server-side API routes for fetching stock data securely.
- `src/components`: Reusable UI components (`StockCard`, `PortfolioSummary`, etc.).
- `src/utils`: Financial calculation utilities.

## 🤝 Contributing
Feel free to open issues or submit pull requests if you have ideas for improvements!
