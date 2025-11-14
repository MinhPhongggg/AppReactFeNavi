// src/api/users.ts
import axios from '@/utils/axios.customize';
import { User } from '@/types/user.types';

export const searchUsers = (query: string): Promise<User[]> => {
  return axios.get(`/users/search?query=${query}`);
};

export const getAllUsers = (): Promise<User[]> => {
  return axios.get('/users');
};