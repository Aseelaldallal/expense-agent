export const TOKENS = {
  // External clients
  OpenAI: Symbol.for('OpenAI'),

  // Services
  UploadService: Symbol.for('UploadService'),
  ExpenseCsvService: Symbol.for('ExpenseCsvService'),
  PolicyRuleExtractorService: Symbol.for('PolicyRuleExtractorService'),
  ExpenseValidatorService: Symbol.for('ExpenseValidatorService'),
  ValidationPipelineService: Symbol.for('ValidationPipelineService'),

  // Controllers
  UploadController: Symbol.for('UploadController'),
  ValidationController: Symbol.for('ValidationController'),
};
