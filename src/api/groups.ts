// src/api/groups.ts
import axios from '@/utils/axios.customize';
import { Group, GroupMember, CreateGroupPayload } from '@/types/group.types';

export const getGroups = (): Promise<Group[]> => {
  return axios.get('/groups');
};

export const getGroupById = (id: string): Promise<Group> => {
  return axios.get(`/groups/${id}`);
};

export const createGroup = (payload: CreateGroupPayload): Promise<Group> => {
  return axios.post(`/groups?creatorId=${payload.creatorId}`, payload.dto);
};

export const removeMember = (memberId: string): Promise<void> => {
  return axios.delete(`/group-members/${memberId}`);
};

export const addMember = (
  groupId: string,
  payload: { userId: string }
): Promise<string> => {
  return axios.post(`/groups/${groupId}/members?userId=${payload.userId}`);
};

export const getGroupMembers = (groupId: string): Promise<GroupMember[]> => {
  return axios.get(`/groups/${groupId}/members`);
};