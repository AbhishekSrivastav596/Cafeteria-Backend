const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const dishRoutes = require('./routes/dishRoutes')
require('./config/db');
const app = express();
const PORT = process.env.PORT || 8080;


app.use(bodyParser.json());
app.use('/dishes',dishRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
