const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const dishRoutes = require('./routes/dishRoutes');
const userRoutes = require('./routes/userRoutes');
const counterRoutes = require('./routes/counterRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
require('./config/db');
const app = express();
const PORT = process.env.PORT || 8080;
const verifyToken = require("./middleware/authMiddleware")

const corsOptions = {
  origin: 'https://cafeteria-frontend-nu.vercel.app/',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/auth', authRoutes)
app.use('/dishes', dishRoutes);
app.use('/users', userRoutes);
app.use('/counters', counterRoutes);
app.use('/cart', verifyToken, cartRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
