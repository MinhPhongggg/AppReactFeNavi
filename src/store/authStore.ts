// src/store/authStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi, registerApi } from '@/api/auth';
import { LoginRequest, RegisterRequest } from '@/types/auth.types';

interface AuthState {
  token: string | null;
  userName: string | null;
  role: string | null;
  userId: string | null;
  status: 'idle' | 'loading' | 'authed' | 'unauthed'; // Trạng thái
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>; // Hàm kiểm tra khi mở app
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  userName: null,
  role: null,
  userId: null,
  status: 'idle', // Ban đầu là 'idle'
  
  login: async (credentials) => {
    set({ status: 'loading' });
    try {
      // 1. Gọi API, nhận về AuthResponse
      const data = await loginApi(credentials);
      
      // 2. Lưu vào AsyncStorage
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('userName', data.userName); //
      await AsyncStorage.setItem('role', data.role);       //
      await AsyncStorage.setItem('userId', data.userId);   //
      
      // 3. Cập nhật state
      set({ ...data, status: 'authed' });
    } catch (error) {
      console.error('Login failed', error);
      set({ status: 'unauthed' });
      throw error;
    }
  },
  
  register: async (data) => {
    set({ status: 'loading' });
    try {
      const responseData = await registerApi(data);
      // Đăng ký xong -> tự động đăng nhập
      await AsyncStorage.setItem('token', responseData.token);
      await AsyncStorage.setItem('userName', responseData.userName);
      await AsyncStorage.setItem('role', responseData.role);
      await AsyncStorage.setItem('userId', responseData.userId);
      set({ ...responseData, status: 'authed' });
    } catch (error) {
      console.error('Register failed', error);
      set({ status: 'unauthed' });
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('role');
    await AsyncStorage.removeItem('userId');
    set({ token: null, userName: null, role: null, status: 'unauthed' });
  },
  
  checkAuth: async () => {
    try {
      // Kiểm tra khi mở app
      const token = await AsyncStorage.getItem('token');
      const userName = await AsyncStorage.getItem('userName');
      const role = await AsyncStorage.getItem('role');
      const userId = await AsyncStorage.getItem('userId');

      if (token && userName && role && userId) {
        set({ token, userName, role, userId, status: 'authed' });
      } else {
        set({ status: 'unauthed' });
      }
    } catch (e) {
      set({ status: 'unauthed' });
    }
  },
}));