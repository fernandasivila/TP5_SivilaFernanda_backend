const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');
const dbconnect = require('./database/database');

const productRoutes = require('./routes/product');
const transactionRoutes = require('./routes/transaction');
const expectantRoutes = require('./routes/expectant');
const ticketRoutes = require('./routes/ticket');

app.use(express.json());
app.use(cors({origin: 'http://localhost:4200'}));

app.use('/products', productRoutes);
app.use('/transactions', transactionRoutes);
app.use('/expectants', expectantRoutes);
app.use('/tickets', ticketRoutes);

app.listen(PORT, () => {
    console.log(`[server]: running on port: http://localhost:${PORT}`);
})

dbconnect();