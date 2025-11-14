// src/app/(tabs)/groups/add-member.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { APP_COLOR } from '@/utils/constant';
import { useUserSearch, useAddMember } from '@/api/hooks';
import { User } from '@/types/user.types';

const AddMemberScreen = () => {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [query, setQuery] = useState('');
  
  // Hooks
  const { data: users, isLoading: isSearching } = useUserSearch(query);
  const { mutate: addMember, isPending: isAdding } = useAddMember(groupId as string);

  const handleAdd = (user: User) => {
    addMember(
      { userId: user.id },
      {
        onSuccess: () => {
          Alert.alert('Thành công', `Đã thêm ${user.name} vào nhóm.`);
        },
        onError: (err: any) => {
          Alert.alert('Lỗi', err.response?.data?.message || err.message);
        },
      }
    );
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Text>{item.name} ({item.email})</Text>
      <TouchableOpacity onPress={() => handleAdd(item)} disabled={isAdding}>
        <Text style={{ color: APP_COLOR.ORANGE }}>Thêm</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Tìm kiếm bằng email hoặc tên..."
      />
      {isSearching && <ActivityIndicator color={APP_COLOR.ORANGE} />}
      <FlatList
        data={users || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Không tìm thấy người dùng.</Text>}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: 'white' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default AddMemberScreen;