// splitapp-fe/src/app/(tabs)/groups/[groupId].tsx
import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // 1. Import hook của router
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { APP_COLOR } from '@/utils/constant';

// 2. Import hook React Query
import { useGetGroupById } from '@/api/hooks';

// 3. Import các file Tab con (chúng ta sẽ tạo chúng sau)
// Hãy đảm bảo bạn tạo các file này trong cùng thư mục `groups/`
import GroupBillsTab from './GroupBillsTab';
import GroupExpensesTab from './GroupExpensesTab';
import GroupMembersTab from './GroupMembersTab';
import GroupStatsTab from './GroupStatsTab';

const Tab = createMaterialTopTabNavigator();

const GroupDetailScreen = () => {
  // 4. Lấy `groupId` từ URL (ví dụ: /groups/123)
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  // 5. Dùng hook để fetch dữ liệu.
  // React Query tự quản lý loading, error, data, và refetch
  const {
    data: group,
    isLoading,
    isError,
  } = useGetGroupById(groupId as string); // Ép kiểu `as string` cho an toàn

  // 6. Xử lý trạng thái loading từ hook
  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={APP_COLOR.ORANGE}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    );
  }

  // 7. Xử lý trạng thái lỗi hoặc không có dữ liệu
  if (isError || !group) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Không tìm thấy thông tin nhóm.</Text>
      </View>
    );
  }


  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: APP_COLOR.ORANGE,
        tabBarInactiveTintColor: 'gray',
        tabBarIndicatorStyle: { backgroundColor: APP_COLOR.ORANGE },
      }}
    >
      <Tab.Screen
        name="Bills"
        component={GroupBillsTab}
        initialParams={{ groupId }}
      />
      <Tab.Screen
        name="Expenses"
        component={GroupExpensesTab}
        initialParams={{ groupId }}
      />
      <Tab.Screen
        name="Members"
        component={GroupMembersTab}
        initialParams={{ groupId }}
      />
      <Tab.Screen
        name="Stats"
        component={GroupStatsTab}
        initialParams={{ groupId }}
      />
    </Tab.Navigator>
  );
};

export default GroupDetailScreen;