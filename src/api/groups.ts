// import api from './axios';
// import { 
//   CreateGroupRequest, 
//   Group, 
//   GroupDetail, 
//   GroupMember, 
//   UpdateGroupRequest,
//   AddMemberRequest 
// } from '@/types';

// // --- Group ---
// export const listGroupsApi = async (): Promise<Group[]> => {
//   const { data } = await api.get<Group[]>('/groups');
//   return data;
// };

// export const getGroupDetailApi = async (groupId: number): Promise<GroupDetail> => {
//   // Kết hợp 2 API calls
//   const { data: groupData } = await api.get<Group>(`/groups/${groupId}`);
//   const { data: membersData } = await api.get<GroupMember[]>(`/groups/${groupId}/members`);
//   return {
//     ...groupData,
//     members: membersData,
//   };
// };

// export const createGroupApi = async (payload: CreateGroupRequest): Promise<Group> => {
//   const { data } = await api.post<Group>('/groups', payload);
//   return data;
// };

// export const updateGroupApi = async (groupId: number, payload: UpdateGroupRequest): Promise<Group> => {
//   const { data } = await api.put<Group>(`/groups/${groupId}`, payload);
//   return data;
// };

// export const deleteGroupApi = async (groupId: number): Promise<void> => {
//   await api.delete(`/groups/${groupId}`);
// };

// // --- Group Member ---
// export const getGroupMembersApi = async (groupId: number): Promise<GroupMember[]> => {
//   const { data } = await api.get<GroupMember[]>(`/groups/${groupId}/members`);
//   return data;
// };



// export const removeMemberApi = async (groupId: number, memberId: number): Promise<void> => {
//   await api.delete(`/groups/${groupId}/members/${memberId}`);
// };

import { GroupMember } from '@/types';
import apiClient from './axios';
import { GroupDTO, GroupMemberDTO, CreateGroupPayload } from '@/types/group.types';

//
export const listGroupsApi = (): Promise<GroupDTO[]> => {
  return apiClient.get('/groups').then(res => res.data);
};

//
export const getGroupDetailApi = (id: string): Promise<GroupDTO> => {
  return apiClient.get(`/groups/${id}`).then(res => res.data);
};

//
export const createGroupApi = (payload: CreateGroupPayload): Promise<GroupDTO> => {
  // Gửi DTO trong body, creatorId làm param
  return apiClient.post(`/groups?creatorId=${payload.creatorId}`, payload.dto)
    .then(res => res.data);
};

//
export const removeMemberApi = (memberId: string): Promise<void> => {
  // GroupMemberController dùng /api/group-members/{id}
  return apiClient.delete(`/group-members/${memberId}`).then(res => res.data);
};

export const addMemberApi = (
  groupId: string, 
  payload: { userId: string }
): Promise<string> => { // <--- SỬA KIỂU TRẢ VỀ Ở ĐÂY
  
  return apiClient.post(
    `/groups/${groupId}/members?userId=${payload.userId}`
  ).then(response => response.data); // data này là "Member added..."
};

export const getGroupMembersApi = async (groupId: string): Promise<GroupMemberDTO[]> => {
  const { data } = await apiClient.get<GroupMemberDTO[]>(`/groups/${groupId}/members`);
  return data;
};

export const deleteGroupApi = async (groupId: string): Promise<void> => {
  await apiClient.delete(`/groups/${groupId}`);
};