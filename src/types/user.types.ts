//
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

//
export interface UserDTO {
  id: string; // UUID -> string
  name: string;
  email: string;
  status: UserStatus;
  roleId: string; // UUID -> string
}