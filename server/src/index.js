import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';

const PORT = process.env.PORT || 5000;

createApp().then(app => {
  const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`[CareerNest API] Server running at http://127.0.0.1:${PORT}`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => console.log('HTTP server closed'));
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
