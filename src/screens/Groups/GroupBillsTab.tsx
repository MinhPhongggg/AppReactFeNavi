// src/screens/Groups/GroupBillsTab.tsx
import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getBillsByGroupApi } from '@/api/bills';
import { BillDTO } from '@/types/bill.types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from '@/navigation/stacks/GroupStack';

type Nav = NativeStackNavigationProp<GroupStackParamList>;

const GroupBillsTab = ({ groupId }: { groupId: string }) => {
  const navigation = useNavigation<Nav>();

  // Hook lấy danh sách hóa đơn của nhóm này
  const { 
    data: billsData, 
    isLoading,
    refetch
  } = useQuery<BillDTO[]>({
    queryKey: ['bills', groupId],
    queryFn: () => getBillsByGroupApi(groupId),
  });

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <FlatList
      data={billsData || []}
      keyExtractor={(item) => item.id}
      onRefresh={refetch}
      refreshing={isLoading}
      ListEmptyComponent={<Text style={styles.centered}>Chưa có hoá đơn nào.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.itemContainer}
          // Bấm vào Bill -> Mở màn hình Chi tiết Bill (BillDetail)
          onPress={() => navigation.navigate('BillDetail', {
            billId: item.id,
            groupId: groupId,
            billDescription: item.description
          })}
        >
          <Text style={styles.itemTitle}>{item.description}</Text>
          <Text>Tổng: {item.totalAmount} {item.currency} - {item.status}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  itemContainer: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderColor: '#eee', 
    backgroundColor: 'white' 
  },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
});

export default GroupBillsTab;