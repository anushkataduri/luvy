const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const customerRoutes = require('./routes/customerRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const contactRoutes = require("./routes/contactRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const setupDatabase = require('./config/setupDb');
const { initWebSocket } = require('./services/websocket');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);

app.get('/', (req, res) => {
  res.send('Backend Running...');
});

const PORT = process.env.PORT || 5000;

// Initialize database schema and then start the server
setupDatabase()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    initWebSocket(server);
  })
  .catch((err) => {
    console.error('Database setup failed. Server not started.', err);
  });