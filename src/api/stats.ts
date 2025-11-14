import apiClient from './axios';
import { BalanceDTO, PaymentStatDTO } from '@/types/stats.types';

// API mới 1
export const getGroupPaymentStatsApi = (groupId: string): Promise<PaymentStatDTO[]> => {
  return apiClient.get(`/expenses/group/${groupId}/stats`).then(res => res.data);
};

// API mới 2
export const getGroupBalancesApi = (groupId: string): Promise<BalanceDTO[]> => {
  return apiClient.get(`/debts/group/${groupId}/net-balances`).then(res => res.data);
};