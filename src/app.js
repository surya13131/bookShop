const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/OrderRoutes');
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.get('/', (req, res) => {
  res.send('📚 Bookshop API Running...');
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Something went wrong!' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
console.log('MONGO_URI:', process.env.MONGO_URI);
