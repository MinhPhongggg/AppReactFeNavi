// src/app/(tabs)/groups/GroupStatsTab.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { APP_COLOR } from '@/utils/constant';
import { useGetGroupPaymentStats, useGetGroupBalances } from '@/api/hooks';

const GroupStatsTab = ({ route }: any) => {
  const { groupId } = route.params;

  // Gọi cả 2 hook
  const { data: stats, isLoading: isLoadingStats } =
    useGetGroupPaymentStats(groupId);
  const { data: balances, isLoading: isLoadingBalances } =
    useGetGroupBalances(groupId);

  if (isLoadingStats || isLoadingBalances) {
    return (
      <ActivityIndicator
        size="large"
        color={APP_COLOR.ORANGE}
        style={styles.center}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Tổng chi tiêu</Text>
        {stats?.map((stat) => (
          <View key={stat.userName} style={styles.row}>
            <Text>{stat.userName}</Text>
            <Text>{stat.totalAmount.toLocaleString('vi-VN')}đ</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Cân bằng nợ</Text>
        {balances?.map((balance) => {
          const amount = parseFloat(balance.netAmount);
          const isOwe = amount < 0;
          return (
            <View key={balance.userId} style={styles.row}>
              <Text>{balance.userName}</Text>
              <Text style={{ color: isOwe ? 'red' : 'green' }}>
                {isOwe ? 'Đang nợ' : 'Được nhận'}{' '}
                {Math.abs(amount).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
});

export default GroupStatsTab;