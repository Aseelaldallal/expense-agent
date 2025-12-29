import 'dotenv/config';
import 'reflect-metadata';
import { validateEnv } from './config/env';
import { initializeContainer } from './container';
import { createApp } from './app';

async function startServer() {
  try {
    validateEnv();
    await initializeContainer();
    const app = createApp();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
