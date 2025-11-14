export type BillStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

//
export interface BillDTO {
  id: string;
  groupId: string;
  categoryId: string;
  description: string;
  totalAmount: number; // BigDecimal
  currency: string;
  status: BillStatus;
  createdTime: string; // Instant
  createdBy: string;
}