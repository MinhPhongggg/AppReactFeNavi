import apiClient from './axios';
import { CategoryDTO } from '@/types/category.types';

//
export const getAllCategoriesApi = (): Promise<CategoryDTO[]> => {
  return apiClient.get('/categories').then(res => res.data);
};