import { inject, injectable } from 'inversify';
import OpenAI from 'openai';
import { TOKENS } from '../container/injection-tokens';
import type { Expense } from '../types/services/expense-csv.types';
import type { ExtractedPolicy } from '../types/services/policy-rule-extractor.types';
import type { ValidationResult } from '../types/services/expense-validator.types';
import {
  EXPENSE_VALIDATION_SYSTEM_PROMPT,
  EXPENSE_VALIDATION_USER_PROMPT,
} from '../prompts/expense-validation.prompts';

const BATCH_SIZE = 5;

@injectable()
export class ExpenseValidatorService {
  constructor(@inject(TOKENS.OpenAI) private readonly openai: OpenAI) {}

  /**
   * Validates expenses against a policy, returning approval status for each.
   * @param expenses - Array of expenses to validate
   * @param extractedPolicy - Policy rules extracted from a policy document
   * @returns Validation result for each expense
   */
  async validate(
    expenses: Expense[],
    extractedPolicy: ExtractedPolicy
  ): Promise<ValidationResult[]> {
    const batches = this.chunkArray(expenses, BATCH_SIZE);
    const results: ValidationResult[] = [];

    for (const batch of batches) {
      const batchResults = await this.validateBatch(batch, extractedPolicy);
      results.push(...batchResults);
    }

    return results;
  }

  private async validateBatch(
    expenses: Expense[],
    extractedPolicy: ExtractedPolicy
  ): Promise<ValidationResult[]> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: EXPENSE_VALIDATION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: EXPENSE_VALIDATION_USER_PROMPT(expenses, extractedPolicy),
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    return this.parseResponse(content);
  }

  private parseResponse(content: string): ValidationResult[] {
    const parsed = JSON.parse(content);
    const { results } = parsed as { results: unknown };

    if (!this.isValidationResultArray(results)) {
      throw new Error('OpenAI response does not match ValidationResult[] structure');
    }

    return results;
  }

  private isValidationResultArray(value: unknown): value is ValidationResult[] {
    if (!Array.isArray(value)) return false;

    for (const item of value) {
      if (typeof item !== 'object' || item === null) return false;
      const r = item as Record<string, unknown>;

      if (typeof r.expense !== 'object' || r.expense === null) return false;
      if (!['approved', 'needs_review', 'violation'].includes(r.status as string)) return false;
      if (typeof r.reason !== 'string') return false;
      if (r.ruleApplied !== undefined && typeof r.ruleApplied !== 'string') return false;
    }

    return true;
  }

  // Splits array into chunks: [1,2,3,4,5,6,7], 3 → [[1,2,3], [4,5,6], [7]]
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
