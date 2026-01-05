export interface Expense {
  date: string;
  employee: string;
  category: string;
  amount: number;
  description: string;
}

export interface PolicyRule {
  category: string;
  maxAmount?: number;
  conditions?: string[];
  plainEnglish: string;
}

export interface ExtractedPolicy {
  rules: PolicyRule[];
  generalRules: string[];
}

export interface ValidationResult {
  expense: Expense;
  status: 'approved' | 'needs_review' | 'violation';
  reason: string;
  ruleApplied?: string;
}

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
