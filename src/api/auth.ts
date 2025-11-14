// src/api/auth.api.ts
import apiClient from './axios';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth.types';

//
export const loginApi = (credentials: LoginRequest): Promise<AuthResponse> => {
  return apiClient.post('/auth/login', credentials).then(res => res.data);
};

//
export const registerApi = (data: RegisterRequest): Promise<AuthResponse> => {
  return apiClient.post('/auth/register', data).then(res => res.data);
};