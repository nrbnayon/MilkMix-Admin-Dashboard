// src/lib/api/consultants.ts
import { apiClient } from './client';
import { API_CONFIG } from './config';
import type { ConsultantRequest, RequestManageRequest } from '@/types/api';

export class ConsultantsAPI {
  static async searchFarm(name: string) {
    return apiClient.get(
      `${API_CONFIG.ENDPOINTS.CONSULTANTS.SEARCH_FARM}?name=${encodeURIComponent(name)}`
    );
  }

  static async requestOnFarm(data: ConsultantRequest) {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.CONSULTANTS.REQUEST,
      data
    );
  }

  static async getAllAcceptedFarms() {
    return apiClient.get(API_CONFIG.ENDPOINTS.CONSULTANTS.FARM_LIST);
  }

  static async manageRequest(requestId: number, data: RequestManageRequest) {
    return apiClient.post(
      `${API_CONFIG.ENDPOINTS.CONSULTANTS.REQUEST_MANAGE}${requestId}/manage/`,
      data
    );
  }
}