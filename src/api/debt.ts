// src/api/debt.api.ts
import apiClient from './axios';

//
export const getReadableBalancesApi = (): Promise<string[]> => {
  // Dùng API BE đã tạo sẵn
  return apiClient.get('/debts/balances/readable').then(res => res.data);
};