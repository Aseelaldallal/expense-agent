import type { Expense, ExtractedPolicy } from '../../../shared/types/api/validation.types';

/**
 * System Prompt: Sets the LLM's role and behavior for the entire conversation.
 * Think of it as "who you are" — defines the assistant's identity and responsibilities.
 * This stays constant across interactions.
 *
 * User Prompt: The actual task/request with specific data.
 * Think of it as "what you need to do" — includes instructions and the data to process.
 * This changes based on the input (expenses, policy, etc.).
 *
 * Example:
 * System: "You are an expense validator."
 * User: "Here are 5 expenses and a policy. Validate them and return JSON."
 */

export const EXPENSE_VALIDATION_SYSTEM_PROMPT =
  'You are an expense validator. Validate expenses against policy rules and return structured JSON with validation results.';

export const EXPENSE_VALIDATION_USER_PROMPT = (
  expenses: Expense[],
  extractedPolicy: ExtractedPolicy
) => `Validate each expense against the policy rules.
Return JSON: { results: ValidationResult[] } where ValidationResult is:
interface ValidationResult {
  expense: Expense;
  status: 'approved' | 'needs_review' | 'violation';
  reason: string;
  ruleApplied?: string;
}
Guidelines:
- Match expenses to rules by category
- Check against maxAmount if it exists
- Check all conditions
- Consider generalRules
- Use "approved" if no violations
- Use "needs_review" if requires manual approval
- Use "violation" if breaks a rule
- Provide clear, specific reasons

Expenses:
${JSON.stringify(expenses, null, 2)}

Policy:
${JSON.stringify(extractedPolicy, null, 2)}`;
