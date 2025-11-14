import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// 1. IMPORT CÁC TYPES ĐÚNG (khớp với DTO của Java)
import { 
  AuthResponse, LoginRequest, RegisterRequest
} from '@/types/auth.types';
import { 
  GroupDTO, GroupMemberDTO, CreateGroupPayload // Dùng các DTO đã tạo
} from '@/types/group.types';
import { UserDTO } from '@/types/user.types';
import { ExpenseDTO, ExpenseShareSaveRequest } from '@/types/expense.types';

// 2. IMPORT CÁC HÀM API ĐÚNG
import { loginApi, registerApi } from '@/api/auth';
import { 
  createGroupApi, listGroupsApi, getGroupDetailApi, 
  deleteGroupApi, getGroupMembersApi, 
  addMemberApi, removeMemberApi 
} from '@/api/groups';
import { getAllUsersApi, searchUsersApi } from '@/api/users';
import { 
  getExpensesByBillApi, createExpenseApi, saveSharesApi, 
  deleteExpenseApi,
  getExpensesByGroupApi
} from '@/api/expense';
import { getReadableBalancesApi } from '@/api/debt';


import { createBillApi } from '@/api/bills';
import { BillDTO } from '@/types/bill.types';

import { getAllCategoriesApi } from '@/api/category';
import { CategoryDTO } from '@/types/category.types';


import { getGroupPaymentStatsApi, getGroupBalancesApi } from '@/api/stats';
import { BalanceDTO, PaymentStatDTO } from '@/types/stats.types';
// --- Auth Hooks ---
export const useLogin = () => {
  return useMutation<AuthResponse, AxiosError, LoginRequest>({
    mutationFn: (payload) => loginApi(payload),
  });
};

export const useRegister = () => {
  // BE trả về AuthResponse khi đăng ký thành công
  //
  return useMutation<AuthResponse, AxiosError, RegisterRequest>({
    mutationFn: (payload) => registerApi(payload),
  });
};

// --- User Hooks ---
//
export const useUserSearch = (query: string) => {
  return useQuery<UserDTO[], AxiosError>({
    queryKey: ['users', 'search', query],
    queryFn: () => searchUsersApi(query),
    enabled: query.length > 1, 
  });
};
// --- Group Hooks ---
//
export const useGroups = () => {
  return useQuery<GroupDTO[], AxiosError>({
    queryKey: ['groups'],
    queryFn: () => listGroupsApi(), // Thêm () => cho nhất quán
  });
};

//
export const useGroupDetail = (groupId: string) => {
  return useQuery<GroupDTO, AxiosError>({
    queryKey: ['group', groupId],
    queryFn: () => getGroupDetailApi(groupId),
    enabled: !!groupId,
  });
};

//
export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<GroupDTO, AxiosError, CreateGroupPayload>({
    mutationFn: (payload) => createGroupApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

//
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: (groupId) => deleteGroupApi(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

// --- Group Member Hooks ---
//
export const useGroupMembers = (groupId: string) => {
  return useQuery<GroupMemberDTO[], AxiosError>({
    queryKey: ['group', groupId, 'members'],
    queryFn: () => getGroupMembersApi(groupId),
    enabled: !!groupId,
  });
};

//
export const useAddMember = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation<string, AxiosError, { userId: string }>({
    mutationFn: (payload) => addMemberApi(groupId, payload), // Bỏ comment và đã sửa
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
    },
  });
};

//
export const useRemoveMember = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, { memberId: string }>({
    mutationFn: (payload) => removeMemberApi(payload.memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
    },
  });
};

// --- Expense & Share Hooks ---

//
export const useExpenses = (billId: string) => {
  return useQuery<ExpenseDTO[], AxiosError>({
    queryKey: ['expenses', billId],
    queryFn: () => getExpensesByBillApi(billId),
    enabled: !!billId,
  });
};

//
export const useCreateExpense = (billId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<ExpenseDTO, AxiosError, Partial<ExpenseDTO>>({
    mutationFn: (payload) => createExpenseApi(payload),
    onSuccess: (data) => { 
      queryClient.invalidateQueries({ queryKey: ['expenses', billId] });
      if (data.groupId) {
        queryClient.invalidateQueries({ queryKey: ['bills', data.groupId] });
      }
    },
  });
};

//
export const useSaveShares = () => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, ExpenseShareSaveRequest>({
    mutationFn: (payload) => saveSharesApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balances'] });
    },
  });
};

// --- Debt & Balance Hooks ---

//
export const useBalances = () => {
  return useQuery<string[], AxiosError>({
    queryKey: ['balances'],
    queryFn: () => getReadableBalancesApi(), // Thêm () => cho nhất quán
  });
};

export const useCreateBill = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation<BillDTO, AxiosError, Partial<BillDTO>>({
    mutationFn: (payload) => createBillApi(payload),
    onSuccess: () => {
      // Tải lại danh sách bills của nhóm này
      queryClient.invalidateQueries({ queryKey: ['bills', groupId] });
    },
  });
};


export const useCategories = () => {
  return useQuery<CategoryDTO[], AxiosError>({
    queryKey: ['categories'],
    queryFn: () => getAllCategoriesApi(),
    staleTime: 1000 * 60 * 5, // Cache danh mục trong 5 phút
  });
};

export const useDeleteExpense = (billId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: (expenseId) => deleteExpenseApi(expenseId),
    onSuccess: () => {
      // Tải lại danh sách expenses của bill này
      queryClient.invalidateQueries({ queryKey: ['expenses', billId] });
      // Tải lại danh sách bills (cập nhật tổng tiền)
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
};

export const useGroupPaymentStats = (groupId: string) => {
  return useQuery<PaymentStatDTO[], AxiosError>({
    queryKey: ['stats', 'payment', groupId],
    queryFn: () => getGroupPaymentStatsApi(groupId),
    enabled: !!groupId,
  });
};

export const useGroupBalances = (groupId: string) => {
  // 2. Sửa kiểu trả về (generic) thành BalanceDTO[]
  return useQuery<BalanceDTO[], AxiosError>({
    queryKey: ['stats', 'balances', groupId],
    
    // 3. Sửa queryFn để gọi đúng API
    queryFn: () => getGroupBalancesApi(groupId), 

    enabled: !!groupId,
  });
};

export const useGroupExpenses = (groupId: string) => {
  return useQuery<ExpenseDTO[], AxiosError>({
    queryKey: ['groupExpenses', groupId],
    queryFn: () => getExpensesByGroupApi(groupId),
    enabled: !!groupId,
  });
};