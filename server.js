const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const dishRoutes = require('./routes/dishRoutes');
const userRoutes = require('./routes/userRoutes');
const counterRoutes = require('./routes/counterRoutes');
const cartRoutes = require('./routes/cartRoutes');
require('./config/db');
const app = express();
const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/dishes',dishRoutes);
app.use('/users',userRoutes);
app.use('/counters',counterRoutes);
app.use('/cart',cartRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
