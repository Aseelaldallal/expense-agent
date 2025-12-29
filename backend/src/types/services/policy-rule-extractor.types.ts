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
