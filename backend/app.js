require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db.config');
const reviewRoutes = require('./src/routes/reviewRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('API is running');
}); //new route

app.use('/api/reviews', reviewRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
