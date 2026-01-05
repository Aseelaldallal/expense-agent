import { inject, injectable } from 'inversify';
import { TOKENS } from '../container/injection-tokens';
import { ExpenseCsvService } from './expense-csv.service';
import { PolicyRuleExtractorService } from './policy-rule-extractor.service';
import { ExpenseValidatorService } from './expense-validator.service';
import type { ValidationPipelineResult } from '../types/services/validation-pipeline.types';

@injectable()
export class ValidationPipelineService {
  constructor(
    @inject(TOKENS.ExpenseCsvService)
    private readonly expenseCsvService: ExpenseCsvService,
    @inject(TOKENS.PolicyRuleExtractorService)
    private readonly policyRuleExtractorService: PolicyRuleExtractorService,
    @inject(TOKENS.ExpenseValidatorService)
    private readonly expenseValidatorService: ExpenseValidatorService
  ) {}

  /**
   * Runs the full validation pipeline: parse expenses, extract policy rules, validate.
   * @param policyContent - Raw policy document content
   * @param expenseContent - Raw CSV content
   * @returns Validation results with debug timing info
   */
  public async run(
    policyContent: string,
    expenseContent: string
  ): Promise<ValidationPipelineResult> {
    // In production: @Timed decorators emit metrics to Datadog/Prometheus, visualized in Grafana.
    // Learning project: No monitoring infra, so we manually collect timing for the debug panel.
    const totalStart = performance.now();

    const parseStart = performance.now();
    const expenses = this.expenseCsvService.parse(expenseContent);
    const parseTimeMs = performance.now() - parseStart;

    const extractStart = performance.now();
    const extractedPolicy = await this.policyRuleExtractorService.extract(policyContent);
    const extractTimeMs = performance.now() - extractStart;

    const validateStart = performance.now();
    const results = await this.expenseValidatorService.validate(expenses, extractedPolicy);
    const validateTimeMs = performance.now() - validateStart;

    const totalTimeMs = performance.now() - totalStart;

    return {
      expenses,
      extractedPolicy,
      results,
      debug: {
        parseTimeMs,
        extractTimeMs,
        validateTimeMs,
        totalTimeMs,
      },
    };
  }
}
