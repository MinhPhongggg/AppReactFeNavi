// src/app/(tabs)/groups/GroupMembersTab.tsx
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
import { GroupMember } from '@/types/group.types';
import { useGetGroupMembers } from '@/api/hooks';

const GroupMembersTab = ({ route }: any) => {
  const { groupId } = route.params;
  const { data: members, isLoading, refetch } = useGetGroupMembers(groupId);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={APP_COLOR.ORANGE}
        style={styles.center}
      />
    );
  }

  const renderItem = ({ item }: { item: GroupMember }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.userName}</Text>
      <Text>{item.roleName}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={members || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Không có thành viên nào.</Text>
          </View>
        }
        onRefresh={refetch}
        refreshing={isLoading}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({
            pathname: '/(tabs)/groups/add-member',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default GroupMembersTab;