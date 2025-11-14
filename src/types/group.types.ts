// src/types/group.types.ts
export interface GroupMember {
  id: string; // UUID
  groupId: string;
  userId: string;
  roleId: string;
  userName: string;
  roleName: string;
}

export interface Group {
  id: string; // UUID
  groupName: string;
  description?: string;
  createdBy: string; // UUID
  members: GroupMember[];
}

// Dùng để tạo nhóm mới, khớp với GroupController
export interface CreateGroupPayload {
  dto: Omit<Group, 'id' | 'members' | 'createdBy'>; // DTO chỉ chứa groupName, description
  creatorId: string;
}