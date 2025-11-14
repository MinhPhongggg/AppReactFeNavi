// src/navigation/AppNavigator.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '@/store/authStore';
import { AuthStack } from '@/navigation/stacks/AuthStack';
import { MainTabs } from '@/navigation/stacks/MainTabs';
import LoadingScreen from '@/screens/LoadingScreen';

// Cài đặt React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

const AppNavigator = () => {
  const status = useAuthStore(state => state.status);
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth(); // Kiểm tra khi mở app
  }, [checkAuth]);

  // Hiển thị màn hình chờ khi chưa biết trạng thái
  if (status === 'idle') {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {status === 'authed' ? <MainTabs /> : <AuthStack />}
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default AppNavigator;