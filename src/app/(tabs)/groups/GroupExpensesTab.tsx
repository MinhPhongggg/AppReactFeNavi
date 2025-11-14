// src/app/(tabs)/groups/GroupExpensesTab.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { APP_COLOR } from '@/utils/constant';
import { Expense } from '@/types/expense.types';
import { useGetExpensesByGroup } from '@/api/hooks'; // Dùng hook

const GroupExpensesTab = ({ route }: any) => {
  const { groupId } = route.params;
  const { data: expenses, isLoading, refetch } = useGetExpensesByGroup(groupId);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={APP_COLOR.ORANGE}
        style={styles.center}
      />
    );
  }

  const renderItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      // TODO: Tạo màn hình chi tiết expense nếu cần
      // onPress={() => router.push(`/(tabs)/groups/expense/${item.id}`)}
    >
      <Text style={styles.itemName}>{item.description}</Text>
      <Text>{item.amount.toLocaleString('vi-VN')}đ</Text>
      <Text style={{ color: 'blue' }}>Trả bởi: {item.paidBy}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Chưa có chi tiêu nào.</Text>
          </View>
        }
        onRefresh={refetch}
        refreshing={isLoading}
      />
      {/* Nút FAB để tạo expense (tạm thời trỏ về create-bill, bạn có thể tạo create-expense sau) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({
            pathname: '/(tabs)/groups/create-group',
            params: { groupId: groupId },
          })
        }
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  itemContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: APP_COLOR.ORANGE,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabText: { fontSize: 30, color: 'white' },
});

export default GroupExpensesTab;