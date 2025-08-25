// src/lib/api/milkHistory.ts
import { apiClient } from './client';
import { API_CONFIG } from './config';
import type { MilkHistoryRequest, MilkHistoryResponse } from '@/types/api';

export class MilkHistoryAPI {
  static async create(data: MilkHistoryRequest) {
    return apiClient.post<{ message: string; data: MilkHistoryResponse }>(
      API_CONFIG.ENDPOINTS.MILK_HISTORY.CREATE,
      data
    );
  }

  static async getAll() {
    return apiClient.get<MilkHistoryResponse[]>(
      API_CONFIG.ENDPOINTS.MILK_HISTORY.LIST
    );
  }

  static async getByUser(userId: number) {
    return apiClient.get<MilkHistoryResponse[]>(
      `${API_CONFIG.ENDPOINTS.MILK_HISTORY.BY_USER}${userId}/`
    );
  }
}