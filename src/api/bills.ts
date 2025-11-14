// src/api/bills.ts
import axios from '@/utils/axios.customize';
import { Bill } from '@/types/bill.types';

export const createBill = (dto: Partial<Bill>): Promise<Bill> => {
  return axios.post('/bills', dto);
};

export const getBillsByGroup = (groupId: string): Promise<Bill[]> => {
  return axios.get(`/bills/group/${groupId}`);
};

export const getBillById = (billId: string): Promise<Bill> => {
  return axios.get(`/bills/${billId}`);
};