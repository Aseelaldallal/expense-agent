import type { Expense } from './expense-csv.types';

export interface ValidationResult {
  expense: Expense;
  status: 'approved' | 'needs_review' | 'violation';
  reason: string;
  ruleApplied?: string;
}
