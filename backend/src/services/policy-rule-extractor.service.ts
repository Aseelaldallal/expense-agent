import { inject, injectable } from 'inversify';
import OpenAI from 'openai';
import { TOKENS } from '../container/injection-tokens';

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
}
