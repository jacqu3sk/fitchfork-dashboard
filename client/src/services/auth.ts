import type { ApiResponse } from '@/utils/api';
import { apiFetch } from '@/utils/api';

export interface LoginRequest {
    username: string,
    password: string
}

export interface LoginResponse {
    token: string,
    expiresIn: string
}

export const AuthService = {
  login: (request: LoginRequest): Promise<ApiResponse<LoginResponse | null>> =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  logout: (): void => {
    localStorage.removeItem('auth');
    window.location.href = '/login';
  },
};
