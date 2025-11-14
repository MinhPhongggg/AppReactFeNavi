// src/screens/Groups/GroupOverviewTab.tsx
import React from 'react';
import { 
  View, Text, ActivityIndicator, StyleSheet, 
  Button, Dimensions, ScrollView, RefreshControl 
} from 'react-native';
// Đảm bảo bạn import đúng 2 hook này
import { useGroupBalances, useGroupPaymentStats } from '@/api/hooks';
import { PaymentStatDTO, BalanceDTO } from '@/types/stats.types';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// Hàm tạo màu
const getRandomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');

const GroupOverviewTab = ({ groupId }: { groupId: string }) => {
  // 1. Gọi hook lấy "Ai nợ ai" (API .../net-balances)
  const { data: balances, isLoading: loadingBalances, refetch: refetchBalances } = useGroupBalances(groupId);
  // 2. Gọi hook lấy "Ai đã trả" (API .../stats)
  const { data: stats, isLoading: loadingStats, refetch: refetchStats } = useGroupPaymentStats(groupId);

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchBalances(), refetchStats()]);
    setIsRefreshing(false);
  }, [refetchBalances, refetchStats]);
  
  // 3. Xử lý dữ liệu cho Biểu đồ
  const pieChartData = stats?.map((stat: PaymentStatDTO) => ({
    name: stat.userName,
    population: Number(stat.totalAmount),
    color: getRandomColor(),
    legendFontColor: '#333',
    legendFontSize: 14,
  })) || [];
  
  const totalSpent = pieChartData.reduce((sum, item) => sum + item.population, 0);

  if (loadingBalances || loadingStats) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* PHẦN BIỂU ĐỒ TRÒN (Giống ảnh 728404.png) */}
      <Text style={styles.header}>Ai đã trả tiền (Tổng: {totalSpent.toLocaleString()} đ)</Text>
      {pieChartData.length > 0 ? (
        <PieChart
          data={pieChartData}
          width={screenWidth}
          height={200}
          chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={styles.emptyText}>Chưa có chi tiêu.</Text>
      )}

      {/* PHẦN AI NỢ AI (Giống ảnh 1000003656.jpg) */}
      <Text style={styles.header}>Tổng kết nợ</Text>
      <View style={styles.balanceList}>
        {balances && balances.length > 0 ? (
          balances.map((item: BalanceDTO) => { 
            const amount = parseFloat(item.netAmount); 
            return (
              <View style={styles.row} key={item.userId}>
                <Text style={styles.name}>{item.userName}</Text>
                <Text style={amount < 0 ? styles.negative : styles.positive}>
                  {amount.toLocaleString()} đ 
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>Nhóm này đã sòng phẳng.</Text>
        )}
      </View>
      
      {/* Nút Settle Up / Invite */}
      <View style={styles.buttonContainer}>
        <Button title="Settle up" onPress={() => { /* Logic thanh toán nợ */ }} />
        <Button title="Invite" onPress={() => { /* Logic mời */ }} />
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 18, fontWeight: 'bold', marginTop: 20, paddingHorizontal: 15, marginBottom: 10 },
  emptyText: { paddingHorizontal: 15, color: 'gray' },
  balanceList: { paddingHorizontal: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontSize: 16 },
  positive: { fontSize: 16, color: 'green', fontWeight: 'bold' },
  negative: { fontSize: 16, color: 'red', fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, marginVertical: 20 },
});

export default GroupOverviewTab;