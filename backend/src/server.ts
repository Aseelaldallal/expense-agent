import 'dotenv/config';
import 'reflect-metadata';
import { initializeContainer } from './container';
import { createApp } from './app';

const PORT = process.env.PORT;

async function startServer() {
  try {
    await initializeContainer();
    const app = createApp();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
