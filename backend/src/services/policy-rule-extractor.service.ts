import { inject, injectable } from 'inversify';
import OpenAI from 'openai';
import fs from 'fs/promises';
import { TOKENS } from '../container/injection-tokens';
import type { ExtractedPolicy } from '../types/services/policy-rule-extractor.types';
import {
  POLICY_EXTRACTION_SYSTEM_PROMPT,
  POLICY_EXTRACTION_USER_PROMPT,
} from '../prompts/policy-extraction.prompts';

/**
 * @injectable() tells Inversify:
 *   - This class can be instantiated by the container
 *   - Read constructor metadata to find dependencies to inject (the OpenAI client)
 *
 * Without @injectable(), Inversify can't read the constructor metadata
 * and won't know to inject OpenAI.
 */
@injectable()
export class PolicyRuleExtractorService {
  constructor(@inject(TOKENS.OpenAI) private readonly openai: OpenAI) {}

  /**
 * Extracts expense rules from a policy document using OpenAI.
 * 
 * NOTE: This implementation loads the entire file into memory, which is
 * inefficient for large files. For this learning project with small text
 * files (< 100KB), this is acceptable.
 */
  async extract(filePath: string): Promise<ExtractedPolicy> {
    const policyText = await this.readPolicyFile(filePath);
    const response = await this.callOpenAI(policyText);
    return this.parseResponse(response);
  }

  private async readPolicyFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read policy file at ${filePath}: ${(error as Error).message}`);
    }
  }

  private async callOpenAI(policyText: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: POLICY_EXTRACTION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: POLICY_EXTRACTION_USER_PROMPT(policyText),
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }
    return content;
  }

  private parseResponse(content: string): ExtractedPolicy {
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error('Failed to parse OpenAI response as JSON');
    }

    if (!this.isExtractedPolicy(parsed)) {
      throw new Error('OpenAI response does not match ExtractedPolicy structure');
    }

    return parsed;
  }

  private isExtractedPolicy(value: unknown): value is ExtractedPolicy {
    if (typeof value !== 'object' || value === null) return false;
    const obj = value as Record<string, unknown>;

    if (!Array.isArray(obj.rules)) return false;
    if (!Array.isArray(obj.generalRules)) return false;

    for (const rule of obj.rules) {
      if (typeof rule !== 'object' || rule === null) return false;
      const r = rule as Record<string, unknown>;
      if (typeof r.category !== 'string') return false;
      if (typeof r.plainEnglish !== 'string') return false;
      if (r.maxAmount !== undefined && typeof r.maxAmount !== 'number') return false;
      if (r.conditions !== undefined && !Array.isArray(r.conditions)) return false;
    }

    for (const generalRule of obj.generalRules) {
      if (typeof generalRule !== 'string') return false;
    }

    return true;
  }
}
