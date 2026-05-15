const express = require('express');
const cors = require('cors');
require('dotenv').config();

const youtubeRoutes = require('./routes/youtube');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

const origins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['*'];
app.use(cors({ origin: origins }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api', youtubeRoutes);

// Fallback 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Yutuber backend listening on port ${PORT}`);
  });
}

module.exports = app;
