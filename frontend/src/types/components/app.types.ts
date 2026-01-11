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
  // Server response fields
  id?: string;
  serverPath?: string;
}

export interface DebugTiming {
  parseTimeMs: number;
  extractTimeMs: number;
  validateTimeMs: number;
  totalTimeMs: number;
}
