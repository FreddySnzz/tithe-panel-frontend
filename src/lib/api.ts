import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, headers, ...rest } = options;

  const authToken =
    token ?? (typeof window !== 'undefined' ? Cookies.get('token') : undefined);

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const resolvedHeaders: Record<string, string> = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(headers as Record<string, string>),
  };

  if (authToken) {
    resolvedHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: resolvedHeaders,
    body:
      body !== undefined
        ? isFormData
          ? body
          : JSON.stringify(body)
        : undefined,
  });

  if (!response.ok) {
    if (
      response.status === 401 &&
      typeof window !== 'undefined' &&
      !endpoint.startsWith('/auth/login')
    ) {
      Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = '/login';
    }

    let errorMessage = 'Erro ao processar requisição.';
    try {
      const errorData = await response.json();
      if (Array.isArray(errorData?.message)) {
        errorMessage = errorData.message[0];
      } else if (typeof errorData?.message === 'string') {
        errorMessage = errorData.message;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiError(errorMessage, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};