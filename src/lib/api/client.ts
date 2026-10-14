const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

class ApiClient {
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('xenstaff_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const activeOrgId = localStorage.getItem('xenstaff_active_org_id');
      if (activeOrgId) {
        headers['X-Organization-ID'] = activeOrgId;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get('content-type');
    let data: any = {};
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const message =
        data?.error?.message ||
        data?.detail ||
        (typeof data === 'string' ? data : 'An unexpected server error occurred.');
      throw new ApiError(message, response.status, data?.error?.details || data);
    }

    return data as T;
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    let url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
      const qs = query.toString();
      if (qs) url += `?${qs}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, body?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, body: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  getDownloadUrl(path: string): string {
    return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  }
}

export const apiClient = new ApiClient();
