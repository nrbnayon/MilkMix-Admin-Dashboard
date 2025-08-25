// src/lib/api/notifications.ts
import { apiClient } from './client';
import { API_CONFIG } from './config';
import type { Notification } from '@/types/api';

export class NotificationsAPI {
  static async getAll() {
    return apiClient.get<Notification[]>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST
    );
  }

  static async markAsRead(notificationId: number) {
    return apiClient.post(
      `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_READ}${notificationId}/`
    );
  }
}