import 'reflect-metadata';
import { Container } from 'inversify';
import OpenAI from 'openai';
import { TOKENS } from './injection-tokens';
import { UploadService } from '../services/upload.service';
import { ExpenseCsvService } from '../services/expense-csv.service';
import { UploadController } from '../controllers/upload.controller';
import { PolicyRuleExtractorService } from '../services/policy-rule-extractor.service';
import { ExpenseValidatorService } from '../services/expense-validator.service';

/**
 * Inversify Dependency Injection Container
 *
 * TOKENS (from injection-tokens.ts) are unique Symbols used as lookup keys.
 * Think of the container as a dictionary mapping tokens to implementations.
 *
 * How it works:
 *   1. Here we register: bind(TOKENS.OpenAI).toConstantValue(openai)
 *      This says: "When someone asks for TOKENS.OpenAI, return this OpenAI instance"
 *
 *   2. In classes we request: @inject(TOKENS.OpenAI) openai: OpenAI
 *      This says: "Give me whatever is registered for TOKENS.OpenAI"
 *
 *   3. Inversify looks up the token, finds the bound instance/class, and injects it
 *
 * Binding methods:
 *   | Method                      | Who creates instance? | @injectable() needed? |
 *   |-----------------------------|----------------------|----------------------|
 *   | .to(Class)                  | Inversify            | Yes                  |
 *   | .toConstantValue(instance)  | You                  | No                   |
 *
 * When to use each:
 *   - Our classes: use .to(Class) - Inversify creates and manages them
 *   - Third-party (OpenAI, etc.): use .toConstantValue() - they don't have
 *     @injectable() decorators and often need special initialization
 *   - Config values (env vars): use .toConstantValue() for simple strings
 *
 * Scopes (only applies to .to() bindings):
 *   - inSingletonScope(): One instance shared across the entire app
 *   - inTransientScope(): New instance every time (default if not specified)
 */

let container: Container | null = null;

export async function initializeContainer(): Promise<Container> {
  container = new Container();

  // External clients
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  container.bind<OpenAI>(TOKENS.OpenAI).toConstantValue(openai);

  // Services
  container.bind<UploadService>(TOKENS.UploadService).to(UploadService).inSingletonScope();
  container.bind<ExpenseCsvService>(TOKENS.ExpenseCsvService).to(ExpenseCsvService).inSingletonScope();
  container
    .bind<PolicyRuleExtractorService>(TOKENS.PolicyRuleExtractorService)
    .to(PolicyRuleExtractorService)
    .inSingletonScope();
  container
    .bind<ExpenseValidatorService>(TOKENS.ExpenseValidatorService)
    .to(ExpenseValidatorService)
    .inSingletonScope();

  // Controllers
  container.bind<UploadController>(TOKENS.UploadController).to(UploadController).inSingletonScope();

  return container;
}

export function getContainer(): Container {
  if (!container) {
    throw new Error('Container not initialized. Call initializeContainer() first.');
  }
  return container;
}
