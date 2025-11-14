// src/api/hooks.ts (Phiên bản đồng nhất cuối cùng)

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IUserAuth } from '@/context/app.context'; 

// 1. IMPORT CÁC TYPES ĐÃ ĐỒNG NHẤT
import { Group, GroupMember, CreateGroupPayload } from '@/types/group.types';
import { User } from '@/types/user.types';
import { Expense, ExpenseShareSaveRequest } from '@/types/expense.types';
import { Bill } from '@/types/bill.types';
import { Category } from '@/types/category.types';
import { Balance, PaymentStat } from '@/types/stats.types';

// 2. IMPORT CÁC HÀM API ĐÃ ĐỒNG NHẤT
// Auth API (từ file có sẵn của splitapp-fe)
import { loginAPI, registerAPI } from '@/utils/api';

// Các API tính năng
import {
  createGroup,
  getGroups,
  getGroupById,
  getGroupMembers,
  addMember,
  removeMember,
} from '@/api/groups';
import { getAllUsers, searchUsers } from '@/api/users';
import {
  getExpensesByBill,
  createExpense,
  saveExpenseShares,
  deleteExpense,
  getExpensesByGroup,
} from '@/api/expense';
import { getReadableBalances } from '@/api/debt';
import { createBill, getBillsByGroup, getBillById } from '@/api/bills';
import { getAllCategories } from '@/api/category';
import { getGroupPaymentStats, getGroupBalances } from '@/api/stats';

// --- Auth Hooks (Sử dụng api.ts của splitapp-fe) ---
interface LoginPayload {
  email: string;
  password: string;
}
export const useLogin = () => {
  return useMutation<IUserAuth, AxiosError, LoginPayload>({
    mutationFn: (payload) => loginAPI(payload.email, payload.password),
  });
};

interface RegisterPayload {
  userName: string;
  email: string;
  password: string;
}
export const useRegister = () => {
  return useMutation<IUserAuth, AxiosError, RegisterPayload>({
    mutationFn: (payload) =>
      registerAPI(payload.userName, payload.email, payload.password),
  });
};

// --- User Hooks ---
export const useUserSearch = (query: string) => {
  return useQuery<User[], AxiosError>({
    queryKey: ['users', 'search', query],
    queryFn: () => searchUsers(query),
    enabled: query.length > 1,
  });
};

// --- Group Hooks ---
export const useGetGroups = () => {
  return useQuery<Group[], AxiosError>({
    queryKey: ['groups'],
    queryFn: getGroups,
  });
};

export const useGetGroupById = (groupId: string) => {
  return useQuery<Group, AxiosError>({
    queryKey: ['group', groupId],
    queryFn: () => getGroupById(groupId),
    enabled: !!groupId,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<Group, AxiosError, CreateGroupPayload>({
    mutationFn: (payload) => createGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

// --- Group Member Hooks ---
export const useGetGroupMembers = (groupId: string) => {
  return useQuery<GroupMember[], AxiosError>({
    queryKey: ['group', groupId, 'members'],
    queryFn: () => getGroupMembers(groupId),
    enabled: !!groupId,
  });
};

export const useAddMember = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation<string, AxiosError, { userId: string }>({
    mutationFn: (payload) => addMember(groupId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
    },
  });
};

export const useRemoveMember = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, { memberId: string }>({
    mutationFn: (payload) => removeMember(payload.memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
    },
  });
};

// --- Expense & Share Hooks ---
export const useGetExpensesByBill = (billId: string) => {
  return useQuery<Expense[], AxiosError>({
    queryKey: ['expenses', billId],
    queryFn: () => getExpensesByBill(billId),
    enabled: !!billId,
  });
};

export const useCreateExpense = (billId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Expense, AxiosError, Partial<Expense>>({
    mutationFn: (payload) => createExpense(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', billId] });
      if (data.groupId) {
        queryClient.invalidateQueries({ queryKey: ['bills', data.groupId] });
      }
    },
  });
};

export const useSaveExpenseShares = () => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, ExpenseShareSaveRequest>({
    mutationFn: (payload) => saveExpenseShares(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balances'] });
    },
  });
};

// --- Bill Hooks ---
export const useCreateBill = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Bill, AxiosError, Partial<Bill>>({
    mutationFn: (payload) => createBill(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills', groupId] });
    },
  });
};
export const useGetBillsByGroup = (groupId: string) => {
  return useQuery<Bill[], AxiosError>({
    queryKey: ['bills', groupId],
    queryFn: () => getBillsByGroup(groupId),
    enabled: !!groupId, // Chỉ chạy khi có groupId
  });
};

export const useGetBillById = (billId: string) => {
  return useQuery<Bill, AxiosError>({
    queryKey: ['bill', billId],
    queryFn: () => getBillById(billId),
    enabled: !!billId, // Chỉ chạy khi có billId
  });
};
export const useDeleteExpense = (billId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: (expenseId) => deleteExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', billId] });
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
};

// --- Category Hooks ---
export const useGetCategories = () => {
  return useQuery<Category[], AxiosError>({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 5, // Cache danh mục trong 5 phút
  });
};

// --- Debt & Stats Hooks ---
export const useGetReadableBalances = () => {
  return useQuery<string[], AxiosError>({
    queryKey: ['balances'],
    queryFn: getReadableBalances,
  });
};

export const useGetGroupPaymentStats = (groupId: string) => {
  return useQuery<PaymentStat[], AxiosError>({
    queryKey: ['stats', 'payment', groupId],
    queryFn: () => getGroupPaymentStats(groupId),
    enabled: !!groupId,
  });
};

export const useGetGroupBalances = (groupId: string) => {
  return useQuery<Balance[], AxiosError>({
    queryKey: ['stats', 'balances', groupId],
    queryFn: () => getGroupBalances(groupId),
    enabled: !!groupId,
  });
};

export const useGetExpensesByGroup = (groupId: string) => {
  return useQuery<Expense[], AxiosError>({
    queryKey: ['groupExpenses', groupId],
    queryFn: () => getExpensesByGroup(groupId),
    enabled: !!groupId,
  });
};