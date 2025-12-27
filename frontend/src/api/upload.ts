import { PolicyUploadResult } from '../types';

const API_BASE = '/api';

export async function uploadPolicy(file: File): Promise<PolicyUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload/policy`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload policy');
  }

  return response.json();
}
