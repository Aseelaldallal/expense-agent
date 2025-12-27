export type ValidationStatus = 'approved' | 'needs_review' | 'violation';

export interface ExtractedRule {
  category: string;
  maxAmount: number | null;
  conditions: string[];
}

export interface ValidationResult {
  expense: string;
  amount: number;
  status: ValidationStatus;
  reason: string;
  rule: string;
}

export interface UploadedFile {
  name: string;
  size: string;
  details?: string;
}
