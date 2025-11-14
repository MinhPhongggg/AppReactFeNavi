import React, { useLayoutEffect } from 'react'; // Sửa import
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Button } from 'react-native'; // Thêm Button
import { useQuery } from '@tanstack/react-query';
import { listGroupsApi } from '@/api/groups';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from '@/navigation/stacks/GroupStack';
import { GroupDTO } from '@/types/group.types';

type Nav = NativeStackNavigationProp<GroupStackParamList, 'GroupList'>;

const GroupListScreen = () => {
  const navigation = useNavigation<Nav>();

  const { data: groups, isLoading, refetch } = useQuery<GroupDTO[]>({
    queryKey: ['groups'],
    queryFn: listGroupsApi,
  });

  // Thêm nút "Tạo nhóm" vào Header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button 
          title="Tạo" 
          onPress={() => navigation.navigate('CreateGroup')} 
        />
      ),
    });
  }, [navigation]);

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.id}
      onRefresh={refetch}
      refreshing={isLoading}
      ListEmptyComponent={<Text style={styles.centered}>Chưa có nhóm nào.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.itemContainer}
          onPress={() => navigation.navigate('GroupDetail', { 
            groupId: item.id, 
            groupName: item.groupName 
          })}
        >
          <Text style={styles.itemTitle}>{item.groupName}</Text>
          <Text>Số thành viên: {item.members?.length || 0}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  itemContainer: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: 'white' },
  itemTitle: { fontSize: 18, fontWeight: 'bold' },
});

export default GroupListScreen;