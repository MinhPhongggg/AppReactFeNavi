import api from './axios';
import { User } from '@/types';
import apiClient from './axios';
// ❗ SỬA IMPORT: Phải dùng UserDTO từ file types của chúng ta
import { UserDTO } from '@/types/user.types';

export const searchUsersApi = (query: string): Promise<UserDTO[]> => {
  return apiClient.get(`/users/search?query=${query}`).then(res => res.data);
};
export const getAllUsersApi = (): Promise<UserDTO[]> => {
  return apiClient.get('/users').then(res => res.data);
};