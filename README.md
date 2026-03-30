# Sales Management Dashboard

A Node.js web application for managing daily sales, expenses (rent, electricity, water, wifi), and worker payments with a beautiful dashboard.

## Features

- **Record Daily Sales**: Track product sales with quantity and price
- **Manage Expenses**: Add monthly expenses for rent, electricity, water, wifi, and other costs
- **Worker Management**: Add workers with monthly payments and track payment status
- **Dashboard**: Real-time overview of:
  - Total sales for the current month
  - Total expenses for the current month
  - Worker payments for the current month
  - Net profit calculation

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: LowDB (JSON file-based database)
- **Frontend**: HTML5, CSS3, JavaScript (no framework required)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Recording a Sale
1. Click on "Record Sale" tab
2. Enter product name, quantity, and price per unit
3. Click "Record Sale"

### Adding an Expense
1. Click on "Add Expense" tab
2. Select expense type (Rent, Electricity, Water, WiFi, or Other)
3. Enter amount and optional description
4. Click "Add Expense"

### Managing Workers
1. Click on "Manage Workers" tab
2. Add a new worker by entering name and monthly payment
3. Use the "Pay Now" button to record monthly payments

### Viewing History
- Click on "Sales History" to view all recorded sales
- Click on "Expenses History" to view all recorded expenses

## API Endpoints

### Sales
- `POST /api/sales` - Record a new sale
- `GET /api/sales` - Get all sales
- `GET /api/sales/month/:month` - Get sales for a specific month (YYYY-MM)

### Expenses
- `POST /api/expenses` - Add a new expense
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/month/:month` - Get expenses for a specific month

### Workers
- `POST /api/workers` - Add a new worker
- `GET /api/workers` - Get all workers
- `POST /api/workers/:id/pay` - Record a payment for a worker

### Dashboard
- `GET /api/dashboard` - Get dashboard summary for current month

## Data Storage

All data is stored in `db.json` file in the root directory. This makes it easy to backup and transfer your data.

## License

ISC