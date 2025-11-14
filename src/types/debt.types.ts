// src/types/debt.types.ts
//
export type DebtStatus = 'UNSETTLED' | 'SETTLED';

//
export interface DebtDTO {
  id: string;
  expenseId: string;
  fromUserId: string; // Người nợ
  toUserId: string;   // Người được trả
  amount: number;
  status: DebtStatus;
}