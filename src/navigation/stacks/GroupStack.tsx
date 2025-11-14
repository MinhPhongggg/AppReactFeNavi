import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupListScreen from '@/screens/Groups/GroupListScreen';
import GroupDetailScreen from '@/screens/Groups/GroupDetailScreen';
import CreateGroupScreen from '@/screens/Groups/CreateGroupScreen'; // <-- THÊM
import AddMemberScreen from '@/screens/Groups/AddMemberScreen'; // <-- THÊM
import CreateBillScreen from '@/screens/Bills/CreateBillScreen'; // <-- THÊM
import BillDetailScreen from '@/screens/Bills/BillDetailScreen';
import CreateExpenseScreen from '@/screens/Expense/CreateExpenseScreen';

export type GroupStackParamList = {
  GroupList: undefined;
  GroupDetail: { groupId: string; groupName: string };
  CreateGroup: undefined; // <-- THÊM
  AddMember: { groupId: string }; // <-- THÊM
  CreateBill: { groupId: string }; // <-- THÊM

  BillDetail: { billId: string; groupId: string; billDescription: string };
  CreateExpense: { billId: string; groupId: string };
};

const Stack = createNativeStackNavigator<GroupStackParamList>();

export const GroupStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GroupList" component={GroupListScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      {/* Các màn hình modal (hiện từ dưới lên) */}
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={{ presentation: 'modal', title: 'Tạo nhóm mới' }}
      />
      <Stack.Screen
        name="AddMember"
        component={AddMemberScreen}
        options={{ presentation: 'modal', title: 'Thêm thành viên' }}
      />
      <Stack.Screen
        name="CreateBill"
        component={CreateBillScreen}
        options={{ presentation: 'modal', title: 'Tạo hóa đơn mới' }}
      />
      <Stack.Screen
        name="BillDetail"
        component={BillDetailScreen}
        options={({ route }) => ({ title: route.params.billDescription })}
      />     
      <Stack.Screen
        name="CreateExpense"
        component={CreateExpenseScreen}
        options={{ presentation: 'modal', title: 'Tạo chi phí mới' }}
      />
    </Stack.Navigator>
  );
};