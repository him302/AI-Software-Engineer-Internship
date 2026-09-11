import { ApiResponse } from "../api-types";
import { PredictorInput } from "../validations/predictor.schema";

const API_BASE = '/api';

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

export const apiClient = {
  getColleges: async (params: Record<string, any>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    // For pagination we need the full response to get total pages
    const response = await fetch(`${API_BASE}/colleges?${searchParams}`);
    const data = await response.json();
    if (!response.ok || !data.success) return Promise.reject(new Error(data.error?.message || 'API request failed'));
    return data;
  },
  
  getCollegeBySlug: (slug: string) => fetchAPI<any>(`/colleges/${slug}`),
  
  getComparison: (ids: string[]) => fetchAPI<any[]>(`/compare?ids=${ids.join(',')}`),
  
  predict: (input: PredictorInput) => fetchAPI<any>(`/predict`, {
    method: 'POST',
    body: JSON.stringify(input)
  }),
  
  getMetadata: () => fetchAPI<any>('/metadata'),
  
  saveComparison: (collegeIds: string[]) => fetchAPI<any>('/saved-comparisons', {
    method: 'POST',
    body: JSON.stringify({ collegeIds })
  })
};
