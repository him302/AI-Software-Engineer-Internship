import { SignupInput, LoginInput } from "../validations/auth.schema";
import { ApiResponse } from "../api-types";
import { SessionPayload } from "../auth/session";

const API_BASE = '/api/auth';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    return Promise.reject(new Error(data.error?.message || 'API request failed'));
  }

  return data.data as T;
}

export const authClient = {
  signup: (input: SignupInput) => fetchAPI<SessionPayload>('/signup', { method: 'POST', body: JSON.stringify(input) }),
  login: (input: LoginInput) => fetchAPI<SessionPayload>('/login', { method: 'POST', body: JSON.stringify(input) }),
  logout: () => fetchAPI<null>('/logout', { method: 'POST' }),
  getCurrentUser: () => fetchAPI<SessionPayload>('/me', { method: 'GET' })
};

const SAVED_API_BASE = '/api';

export const savedClient = {
  getSavedColleges: async () => {
    const response = await fetch(`${SAVED_API_BASE}/saved-colleges`);
    const data = await response.json();
    if (!response.ok) return Promise.reject(new Error(data.error?.message || 'Failed to fetch'));
    return data.data;
  },
  saveCollege: async (collegeId: string) => {
    const response = await fetch(`${SAVED_API_BASE}/saved-colleges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collegeId })
    });
    const data = await response.json();
    if (!response.ok) return Promise.reject(new Error(data.error?.message || 'Failed to save'));
    return data.data;
  },
  unsaveCollege: async (collegeId: string) => {
    const response = await fetch(`${SAVED_API_BASE}/saved-colleges/${collegeId}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) return Promise.reject(new Error(data.error?.message || 'Failed to remove'));
    return data.data;
  },
  getSavedComparisons: async () => {
    const response = await fetch(`${SAVED_API_BASE}/saved-comparisons`);
    const data = await response.json();
    if (!response.ok) return Promise.reject(new Error(data.error?.message || 'Failed to fetch'));
    return data.data;
  },
  saveComparison: async (collegeIds: string[]) => {
    const response = await fetch(`${SAVED_API_BASE}/saved-comparisons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collegeIds })
    });
    const data = await response.json();
    if (!response.ok) return Promise.reject(new Error(data.error?.message || 'Failed to save'));
    return data.data;
  },
  deleteComparison: async (id: string) => {
    const response = await fetch(`${SAVED_API_BASE}/saved-comparisons/${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) return Promise.reject(new Error(data.error?.message || 'Failed to remove'));
    return data.data;
  }
};
