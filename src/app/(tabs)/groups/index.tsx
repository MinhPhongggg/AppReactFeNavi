// splitapp-fe/src/app/(tabs)/groups/index.tsx
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
import { Group } from '@/types/group.types';

// 1. Import hook React Query
import { useGetGroups } from '@/api/hooks'; 
// Không cần appState vì hook sẽ tự xử lý (nếu API cần)

const GroupListScreen = () => {
  // 2. Dùng hook để lấy dữ liệu
  // React Query sẽ tự quản lý loading, error, và data
  const { data: groups, isLoading, refetch } = useGetGroups();

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={APP_COLOR.ORANGE}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    );
  }

  const renderItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.groupItem}
      // Dùng router.push và dynamic route
      onPress={() => router.push(`/(tabs)/groups/${item.id}`)}
    >
      {/* 3. Đảm bảo tên trường khớp với file types của bạn */}
      <Text style={styles.groupName}>{item.groupName}</Text> 
      <Text>{item.members.length} thành viên</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={groups || []} // Dùng data từ hook, mặc định là mảng rỗng
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>Bạn chưa tham gia nhóm nào.</Text>}
        // 4. Gắn hàm refetch của React Query vào
        refreshing={isLoading}
        onRefresh={refetch}
      />
      <TouchableOpacity
        style={styles.fab}
        // Dùng router.push
        onPress={() => router.push('/(tabs)/groups/create-group')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// Giữ nguyên styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  groupItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: APP_COLOR.ORANGE, // Dùng màu cam
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

export default GroupListScreen;