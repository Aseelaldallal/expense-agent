import type { ValidationPipelineResult } from '@shared/types/api/validation.types';

const API_BASE = '/api';

export async function validateExpenses(): Promise<ValidationPipelineResult> {
  const response = await fetch(`${API_BASE}/validate`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Validation failed');
  }

  return response.json();
}
