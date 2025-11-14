// src/api/expense.ts
import axios from '@/utils/axios.customize';
import { Expense, ExpenseShareSaveRequest } from '@/types/expense.types';

export const getExpensesByBill = (billId: string): Promise<Expense[]> => {
  return axios.get(`/expenses/bill/${billId}`);
};

export const getExpensesByGroup = (groupId: string): Promise<Expense[]> => {
  return axios.get(`/expenses/group/${groupId}`);
};

export const createExpense = (dto: Partial<Expense>): Promise<Expense> => {
  return axios.post('/expenses', dto);
};

export const saveExpenseShares = (
  request: ExpenseShareSaveRequest
): Promise<any> => {
  return axios.post('/expense-shares/save', request);
};

export const deleteExpense = (expenseId: string): Promise<void> => {
  return axios.delete(`/expenses/${expenseId}`);
};