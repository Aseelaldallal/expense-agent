import type { Expense } from './expense-csv.types';
import type { ExtractedPolicy } from './policy-rule-extractor.types';
import type { ValidationResult } from './expense-validator.types';

export interface ValidationPipelineResult {
  expenses: Expense[];
  extractedPolicy: ExtractedPolicy;
  results: ValidationResult[];
  debug: {
    parseTimeMs: number;
    extractTimeMs: number;
    validateTimeMs: number;
    totalTimeMs: number;
  };
}
