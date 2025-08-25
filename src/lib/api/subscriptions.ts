// src/lib/api/subscriptions.ts
import { apiClient } from './client';
import { API_CONFIG } from './config';
import type { Subscription } from '@/types/api';

export class SubscriptionsAPI {
  static async getAllSubscriptions() {
    return apiClient.get<Subscription[]>(
      API_CONFIG.ENDPOINTS.PAYMENT.ALL_SUBSCRIPTIONS
    );
  }
}