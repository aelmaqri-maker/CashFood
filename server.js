const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize LowDB Database
const defaultData = { sales: [], expenses: [], workers: [] };
const db = new Low(new JSONFile('./db.json'), defaultData);

async function initializeDatabase() {
    await db.read();
    db.data ||= defaultData;
    await db.write();
    console.log('Database initialized.');
}

// API Routes

// Add a sale
app.post('/api/sales', async (req, res) => {
    const { product_name, quantity, price, date } = req.body;
    const total = quantity * price;
    const saleDate = date || new Date().toISOString().split('T')[0];

    await db.read();
    const newSale = {
        id: db.data.sales.length > 0 ? Math.max(...db.data.sales.map(s => s.id)) + 1 : 1,
        product_name,
        quantity,
        price,
        total,
        date: saleDate
    };
    db.data.sales.push(newSale);
    await db.write();
    
    res.json(newSale);
});

// Get all sales
app.get('/api/sales', async (req, res) => {
    await db.read();
    res.json(db.data.sales.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

// Get sales by month
app.get('/api/sales/month/:month', async (req, res) => {
    const { month } = req.params;
    await db.read();
    const filtered = db.data.sales.filter(s => s.date.startsWith(month));
    res.json(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

// Add expense (rent, electricity, water, wifi)
app.post('/api/expenses', async (req, res) => {
    const { type, amount, description, date } = req.body;
    const expenseDate = date || new Date().toISOString().split('T')[0];

    await db.read();
    const newExpense = {
        id: db.data.expenses.length > 0 ? Math.max(...db.data.expenses.map(e => e.id)) + 1 : 1,
        type,
        amount,
        description: description || '',
        date: expenseDate
    };
    db.data.expenses.push(newExpense);
    await db.write();
    
    res.json(newExpense);
});

// Get all expenses
app.get('/api/expenses', async (req, res) => {
    await db.read();
    res.json(db.data.expenses.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

// Get expenses by month
app.get('/api/expenses/month/:month', async (req, res) => {
    const { month } = req.params;
    await db.read();
    const filtered = db.data.expenses.filter(e => e.date.startsWith(month));
    res.json(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

// Add worker
app.post('/api/workers', async (req, res) => {
    const { name, monthly_payment } = req.body;

    await db.read();
    const newWorker = {
        id: db.data.workers.length > 0 ? Math.max(...db.data.workers.map(w => w.id)) + 1 : 1,
        name,
        monthly_payment,
        payment_date: null
    };
    db.data.workers.push(newWorker);
    await db.write();
    
    res.json(newWorker);
});

// Pay worker (monthly payment)
app.post('/api/workers/:id/pay', async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;
    const paymentDate = date || new Date().toISOString().split('T')[0];

    await db.read();
    const worker = db.data.workers.find(w => w.id === parseInt(id));
    if (worker) {
        worker.payment_date = paymentDate;
        await db.write();
        res.json({ message: 'Payment recorded' });
    } else {
        res.status(404).json({ error: 'Worker not found' });
    }
});

// Get all workers
app.get('/api/workers', async (req, res) => {
    await db.read();
    res.json(db.data.workers);
});

// Dashboard summary
app.get('/api/dashboard', async (req, res) => {
    const currentMonth = new Date().toISOString().slice(0, 7);

    await db.read();
    
    const salesThisMonth = db.data.sales
        .filter(s => s.date.startsWith(currentMonth))
        .reduce((sum, s) => sum + s.total, 0);
    
    const expensesThisMonth = db.data.expenses
        .filter(e => e.date.startsWith(currentMonth))
        .reduce((sum, e) => sum + e.amount, 0);
    
    const workersPaidThisMonth = db.data.workers
        .filter(w => w.payment_date && w.payment_date.startsWith(currentMonth))
        .reduce((sum, w) => sum + w.monthly_payment, 0);
    
    const profit = salesThisMonth - expensesThisMonth - workersPaidThisMonth;

    res.json({
        currentMonth,
        totalSales: salesThisMonth,
        totalExpenses: expensesThisMonth,
        totalWorkers: workersPaidThisMonth,
        profit
    });
});

// Start server
async function start() {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

start();
