// src/app/(tabs)/groups/GroupBillsTab.tsx

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
import { Bill } from '@/types/bill.types';

// Import hook mới chúng ta vừa thêm
import { useGetBillsByGroup } from '@/api/hooks';

// Component này được render bởi TopTabNavigator (trong file [groupId].tsx)
// nên nó sẽ tự động nhận `route` prop
const GroupBillsTab = ({ route }: any) => {
  // 1. Lấy groupId từ `initialParams` đã được truyền từ [groupId].tsx
  const { groupId } = route.params;

  // 2. Dùng hook React Query để lấy dữ liệu
  const { data: bills, isLoading, refetch } = useGetBillsByGroup(groupId);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={APP_COLOR.ORANGE}
        style={styles.center}
      />
    );
  }

  const renderItem = ({ item }: { item: Bill }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      // 3. Sửa lệnh điều hướng:
      // Chuyển sang route động /bill/[billId]
      onPress={() => router.push(`/(tabs)/groups/bill/${item.id}`)}
    >
      <Text style={styles.itemName}>{item.description}</Text>
      <Text>{item.totalAmount.toLocaleString('vi-VN')}đ</Text>
      <Text style={{ color: item.status === 'COMPLETED' ? 'green' : 'orange' }}>
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bills || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Chưa có hóa đơn nào.</Text>
          </View>
        }
        // 4. Gắn hàm refetch cho FlatList
        onRefresh={refetch}
        refreshing={isLoading}
      />
      <TouchableOpacity
        style={styles.fab}
        // 5. Sửa lệnh điều hướng cho nút FAB
        onPress={() =>
          router.push({
            pathname: '/(tabs)/groups/create-bill',
            params: { groupId: groupId }, // Truyền groupId cho màn hình CreateBill
          })
        }
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles (giữ nguyên từ code cũ)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  fabText: {
    fontSize: 30,
    color: 'white',
  },
});

export default GroupBillsTab;