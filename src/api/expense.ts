// src/api/expense.api.ts
import apiClient from './axios';
import { ExpenseDTO, ExpenseShareSaveRequest } from '@/types/expense.types';

//
export const getExpensesByBillApi = (billId: string): Promise<ExpenseDTO[]> => {
  return apiClient.get(`/expenses/bill/${billId}`).then(res => res.data);
};

//
export const createExpenseApi = (dto: Partial<ExpenseDTO>): Promise<ExpenseDTO> => {
  return apiClient.post('/expenses', dto).then(res => res.data);
};

//
export const saveSharesApi = (request: ExpenseShareSaveRequest): Promise<any> => {
  return apiClient.post('/expense-shares/save', request).then(res => res.data);
};

export const deleteExpenseApi = (expenseId: string): Promise<void> => {
  return apiClient.delete(`/expenses/${expenseId}`).then(res => res.data);
};

export const getExpensesByGroupApi = (groupId: string): Promise<ExpenseDTO[]> => {
  return apiClient.get(`/expenses/group/${groupId}`).then(res => res.data);
};

