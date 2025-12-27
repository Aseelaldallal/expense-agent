import 'reflect-metadata';
import { Container } from 'inversify';

let container: Container | null = null;

export async function initializeContainer(): Promise<Container> {
  container = new Container();
  // Add bindings here as needed
  return container;
}

export function getContainer(): Container {
  if (!container) {
    throw new Error('Container not initialized. Call initializeContainer() first.');
  }
  return container;
}
