// src/types/api.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'consultant' | 'farm' | 'member';
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  profile_picture?: string;
  is_active?: boolean;
  date_joined?: string;
  last_login?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
  message?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'consultant' | 'farm' | 'member';
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  profile_picture?: File;
}

export interface OTPRequest {
  email: string;
}

export interface OTPVerifyRequest {
  email: string;
  otp: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  email: string;
  otp: string;
  new_password: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

export interface MilkHistoryRequest {
  bottle_size: number;
  number_of_bottles: number;
  hospital_solids: number;
  hospital_milk_volume: number;
  desired_solids_content: number;
  pounds_of_water: number;
  pounds_of_milk_replacer: number;
  solids_hospital_milk: number;
  hospital_milk_used: number;
  total_volume?: string;
}

export interface MilkHistoryResponse {
  id: number;
  user: number;
  user_email: string;
  created_at: string;
  bottle_size: string;
  number_of_bottles: number;
  hospital_solids: string;
  hospital_milk_volume: string;
  desired_solids_content: string;
  pounds_of_water: string;
  pounds_of_milk_replacer: string;
  solids_hospital_milk: string;
  hospital_milk_used: string;
  total_volume?: string;
}

export interface MemberCreateRequest {
  farm: number;
  email: string;
  password: string;
  name: string;
}

export interface ConsultantRequest {
  farm: number;
  consultant: number;
}

export interface RequestManageRequest {
  action: 'accept' | 'reject';
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  user: number;
  plan_name: string;
  status: 'active' | 'inactive' | 'cancelled';
  start_date: string;
  end_date: string;
  amount: number;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  detail?: string;
  non_field_errors?: string[];
  [key: string]: unknown;
}