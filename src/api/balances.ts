// app/src/api/balances.ts
import apiClient from './axios';

//
export const fetchReadableBalances = (): Promise<string[]> => {
  return apiClient.get('/debts/balances/readable').then(response => response.data);
};