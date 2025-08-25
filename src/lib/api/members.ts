// src/lib/api/members.ts
import { apiClient } from './client';
import { API_CONFIG } from './config';
import type { MemberCreateRequest, User } from '@/types/api';

export class MembersAPI {
  static async create(data: MemberCreateRequest) {
    return apiClient.post<{ message: string; user: User }>(
      API_CONFIG.ENDPOINTS.MEMBERS.CREATE,
      data
    );
  }

  static async getByFarm(farmId: number) {
    return apiClient.get<User[]>(
      `${API_CONFIG.ENDPOINTS.MEMBERS.BY_FARM}${farmId}/`
    );
  }

  static async getProfile() {
    return apiClient.get<User>(API_CONFIG.ENDPOINTS.MEMBERS.PROFILE);
  }
}