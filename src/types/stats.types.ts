// src/types/stats.types.ts
export interface PaymentStatDTO {
  userName: string;
  totalAmount: number; // BigDecimal -> number
}

export interface BalanceDTO {
  userId: string;
  userName: string;
  netAmount: string; // Âm là nợ, dương là được trả
}