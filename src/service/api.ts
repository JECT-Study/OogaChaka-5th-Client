import axios, { type AxiosRequestConfig } from 'axios';

export type ApiResponse<T> = { data: T; status: number };
export type ApiError = { message: string; status: number };

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

export async function fetchApi<T>(
  endpoint: string,
  options: AxiosRequestConfig = {},
): Promise<ApiResponse<T>> {
  const { data, status } = await api.request<T>({ ...options, url: endpoint });
  return { data, status };
}
