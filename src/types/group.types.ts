export interface GroupMemberDTO {
  id: string; // UUID
  groupId: string;
  userId: string;
  roleId: string;
  userName: string;
  roleName: string;
}

//
export interface GroupDTO {
  id: string; // UUID
  groupName: string;
  description?: string;
  createdBy: string; // UUID
  members: GroupMemberDTO[];
}

// Dùng để tạo nhóm mới, khớp với GroupController
export interface CreateGroupPayload {
  dto: Omit<GroupDTO, 'id' | 'members' | 'createdBy'>; // DTO chỉ chứa groupName, description
  creatorId: string;
}