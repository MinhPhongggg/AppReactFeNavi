import apiClient from './axios';
import { BillDTO } from '@/types/bill.types';
//
export const createBillApi = (dto: Partial<BillDTO>): Promise<BillDTO> => {
  return apiClient.post('/bills', dto).then(res => res.data);
};
//
export const getBillsByGroupApi = (groupId: string): Promise<BillDTO[]> => {
  return apiClient.get(`/bills/group/${groupId}`).then(res => res.data);
};