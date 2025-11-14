// src/screens/Groups/BillDetailScreen.tsx
import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from '@/navigation/stacks/GroupStack';
import { useExpenses, useDeleteExpense } from '@/api/hooks';
import { ExpenseDTO } from '@/types/expense.types';

type Route = RouteProp<GroupStackParamList, 'BillDetail'>;
type Nav = NativeStackNavigationProp<GroupStackParamList, 'BillDetail'>;

const BillDetailScreen = () => {
  const navigation = useNavigation<Nav>();
  const { billId, groupId } = useRoute<Route>().params;

  // 1. Hook lấy danh sách expenses của bill này
  //
  const { data: expenses, isLoading, refetch } = useExpenses(billId);
  
  // 2. Hook để xoá expense
  const { mutate: deleteExpense } = useDeleteExpense(billId);

  // 3. Thêm nút "Thêm" (Expense) vào header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button 
          title="Thêm" 
          onPress={() => navigation.navigate('CreateExpense', { 
            billId: billId,
            groupId: groupId, // <-- Đảm bảo truyền groupId
          })} 
        />
      ),
    });
  }, [navigation, billId, groupId]);

  const handleDelete = (expenseId: string) => {
    Alert.alert("Xác nhận xoá", "Xoá chi phí này?", [
      { text: "Huỷ" },
      { 
        text: "Xoá", 
        style: "destructive", 
        //
        onPress: () => deleteExpense(expenseId) 
      }
    ]);
  };

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <FlatList
      data={expenses || []}
      keyExtractor={(item) => item.id}
      onRefresh={refetch}
      refreshing={isLoading}
      ListEmptyComponent={<Text style={styles.centered}>Chưa có chi phí nào.</Text>}
      renderItem={({ item }: { item: ExpenseDTO }) => (
        <View style={styles.itemContainer}>
          <View style={styles.info}>
            <Text style={styles.title}>{item.description}</Text>
            <Text>Số tiền: {item.amount} VND</Text>
            {/* Bạn có thể dùng useUsers để lấy tên người trả từ item.paidBy */}
          </View>
          <Button 
            title="Xoá" 
            color="red"
            onPress={() => handleDelete(item.id)}
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold' }
});

export default BillDetailScreen;