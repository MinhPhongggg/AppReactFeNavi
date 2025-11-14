// src/api/debt.ts
import axios from '@/utils/axios.customize';

export const getReadableBalances = (): Promise<string[]> => {
  return axios.get('/debts/balances/readable');
};