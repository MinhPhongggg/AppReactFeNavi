// src/screens/Groups/GroupDetailScreen.tsx
import React from 'react';
import { View, Button } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from '@/navigation/stacks/GroupStack';

// 1. Import 3 Tab con
import GroupStatsTab from './GroupStatsTab';
import GroupBillsTab from './GroupBillsTab'; // Đổi tên từ Expenses
import GroupMembersTab from './GroupMembersTab';

type Route = RouteProp<GroupStackParamList, 'GroupDetail'>;
type Nav = NativeStackNavigationProp<GroupStackParamList, 'GroupDetail'>;

const Tab = createMaterialTopTabNavigator();

const GroupDetailScreen = () => {
  const navigation = useNavigation<Nav>();
  const { groupId } = useRoute<Route>().params;

  // 2. Sửa nút Header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        // Nút "+" (dấu cộng)
        <Button 
          title="+" 
          onPress={() => navigation.navigate('CreateBill', { groupId })} 
        />
      ),
      // Bạn có thể thêm nút "Cài đặt" (hình răng cưa) ở headerLeft
    });
  }, [navigation, groupId]);

  return (
    // 3. Render 3 Tab
    <Tab.Navigator>
      <Tab.Screen name="Hoá đơn">
        {(props) => <GroupBillsTab {...props} groupId={groupId} />}
      </Tab.Screen>
      <Tab.Screen name="Thống kê">
        {(props) => <GroupStatsTab {...props} groupId={groupId} />}
      </Tab.Screen>
      <Tab.Screen name="Thành viên">
        {(props) => <GroupMembersTab {...props} groupId={groupId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default GroupDetailScreen;