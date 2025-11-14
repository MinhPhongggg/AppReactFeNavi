// src/app/(tabs)/groups/bill/[billId].tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { APP_COLOR } from '@/utils/constant';
import { useGetBillById, useGetExpensesByBill, useDeleteExpense } from '@/api/hooks';
import { Expense } from '@/types/expense.types';

const BillDetailScreen = () => {
  const { billId } = useLocalSearchParams<{ billId: string }>();

  // Dùng 3 hooks
  const { data: bill, isLoading: isLoadingBill } = useGetBillById(billId as string);
  const {
    data: expenses,
    isLoading: isLoadingExpenses,
    refetch: refetchExpenses,
  } = useGetExpensesByBill(billId as string);
  const { mutate: deleteExpense } = useDeleteExpense(billId as string);


  const handleDeleteExpense = (expenseId: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa chi tiêu này?", [
      { text: "Hủy" },
      { text: "Xóa", onPress: () => deleteExpense(expenseId) }
    ])
  }

  if (isLoadingBill || isLoadingExpenses) {
    return (
      <ActivityIndicator
        size="large"
        color={APP_COLOR.ORANGE}
        style={styles.center}
      />
    );
  }

  if (!bill) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy hóa đơn.</Text>
      </View>
    );
  }

  const renderExpense = ({ item }: { item: Expense }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.description}</Text>
      <Text>{item.amount.toLocaleString('vi-VN')}đ</Text>
      <TouchableOpacity onPress={() => handleDeleteExpense(item.id)}>
        <Text style={{color: 'red'}}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.title}>{bill.description}</Text>
        <Text style={styles.total}>
          Tổng: {bill.totalAmount.toLocaleString('vi-VN')}đ
        </Text>
      </View>

      {/* Expense List */}
      <FlatList
        data={expenses || []}
        renderItem={renderExpense}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Chưa có chi tiêu nào.</Text>
          </View>
        }
        onRefresh={refetchExpenses}
        refreshing={isLoadingExpenses}
      />

      {/* FAB to Add Expense */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({
            pathname: '/create-expense',
            params: { billId: billId, groupId: bill.groupId },
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20 },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  total: { fontSize: 18, color: APP_COLOR.ORANGE, marginTop: 5 },
  itemContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  itemName: { fontSize: 16 },
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

export default BillDetailScreen;