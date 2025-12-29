export const POLICY_EXTRACTION_SYSTEM_PROMPT =
  'You are an expense policy analyzer. Extract rules from policies and return structured JSON.';

export const POLICY_EXTRACTION_USER_PROMPT = (policyText: string) => `Extract all expense rules from this policy document.
Return JSON matching this TypeScript interface:
interface ExtractedPolicy {
  rules: Array<{
    category: string;
    maxAmount?: number;
    conditions?: string[];
    plainEnglish: string;
  }>;
  generalRules: string[];
}
Guidelines:
- Use consistent lowercase category names
- Only set maxAmount for hard limits, not approval thresholds
- Include all conditions in the array
- Preserve original wording in plainEnglish

Policy document:
${policyText}`;
