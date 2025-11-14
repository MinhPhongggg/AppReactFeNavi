// src/screens/Groups/CreateGroupScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCreateGroup } from '@/api/hooks';
import { useAuthStore } from '@/store/authStore';

const CreateGroupScreen = () => {
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  // 1. Lấy creatorId từ store (đã sửa ở Bước 2)
  const creatorId = useAuthStore(state => state.userId);
  
  const { mutate: createGroup, isPending } = useCreateGroup();

  const handleCreate = () => {
    if (!groupName) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên nhóm');
      return;
    }
    if (!creatorId) {
      Alert.alert('Lỗi', 'Không tìm thấy ID người tạo, vui lòng đăng nhập lại.');
      return;
    }
    
    // 2. Gọi hook
    //
    createGroup({
      dto: { groupName, description },
      creatorId: creatorId,
    }, {
      onSuccess: () => {
        navigation.goBack(); // Đóng modal
      },
      onError: (err) => {
        Alert.alert('Lỗi', 'Không thể tạo nhóm: ' + err.message);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text>Tên nhóm</Text>
      <TextInput
        style={styles.input}
        placeholder="VD: Chuyến đi Vũng Tàu"
        value={groupName}
        onChangeText={setGroupName}
      />
      <Text>Mô tả</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      {isPending ? (
        <ActivityIndicator />
      ) : (
        <Button title="Tạo nhóm" onPress={handleCreate} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 5, marginTop: 5 },
});

export default CreateGroupScreen;