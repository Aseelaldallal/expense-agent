import { inject, injectable } from 'inversify';
import OpenAI from 'openai';
import { TOKENS } from '../container/injection-tokens';
import type { Expense } from '../types/services/expense-csv.types';
import type { ExtractedPolicy } from '../types/services/policy-rule-extractor.types';
import type { ValidationResult } from '../types/services/expense-validator.types';

@injectable()
export class ExpenseValidatorService {
  constructor(@inject(TOKENS.OpenAI) private readonly openai: OpenAI) {}

  async validate(
    expenses: Expense[],
    extractedPolicy: ExtractedPolicy
  ): Promise<ValidationResult[]> {
    throw new Error('Not implemented');
  }
}
