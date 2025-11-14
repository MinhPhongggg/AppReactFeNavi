// src/screens/Groups/GroupExpensesTab.tsx
import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useGroupExpenses, useGroupDetail } from '@/api/hooks';
import { ExpenseDTO } from '@/types/expense.types';

const GroupExpensesTab = ({ groupId }: { groupId: string }) => {
  // 1. Lấy danh sách Expenses của nhóm
  const { data: expenses, isLoading, refetch } = useGroupExpenses(groupId);
  // 2. Lấy chi tiết Group (để lấy tên thành viên)
  const { data: groupData } = useGroupDetail(groupId);

  // Tạo Map để tra cứu tên từ ID
  const memberMap = React.useMemo(() => {
    const map = new Map<string, string>();
    groupData?.members.forEach(m => {
      // Dùng userId làm key (khớp với paidBy)
      map.set(m.userId, m.userName); 
    });
    return map;
  }, [groupData]);

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      onRefresh={refetch}
      refreshing={isLoading}
      ListEmptyComponent={<Text style={styles.centered}>Chưa có chi phí nào.</Text>}
      renderItem={({ item }: { item: ExpenseDTO }) => (
        <TouchableOpacity style={styles.row}>
          {/* (Icon ở đây) */}
          <View>
            <Text style={styles.description}>{item.description}</Text>
            {/* Lấy tên người trả từ Map */}
            <Text>Người trả: {memberMap.get(item.paidBy) || '...'}</Text>
          </View>
          <Text style={styles.amount}>{item.amount.toLocaleString()} đ</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: 'white' },
  description: { fontSize: 16, fontWeight: 'bold' },
  amount: { fontSize: 16, fontWeight: 'bold' },
});

export default GroupExpensesTab;