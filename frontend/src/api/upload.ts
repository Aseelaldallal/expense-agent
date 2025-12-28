import type { FileUploadResult } from '../types/api/upload.types';

const API_BASE = '/api';

export async function uploadPolicy(file: File): Promise<FileUploadResult> {
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

export async function uploadExpense(file: File): Promise<FileUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload/expense`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload expense');
  }

  return response.json();
}

export async function deletePolicy(): Promise<void> {
  const response = await fetch(`${API_BASE}/upload/policy`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete policy');
  }
}

export async function deleteExpense(): Promise<void> {
  const response = await fetch(`${API_BASE}/upload/expense`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete expense');
  }
}
