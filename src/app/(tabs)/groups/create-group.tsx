// src/app/(tabs)/groups/create-group.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { APP_COLOR } from '@/utils/constant';
import { useCreateGroup } from '@/api/hooks';
import { useCurrentApp } from '@/context/app.context';

const CreateGroupScreen = () => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const { appState } = useCurrentApp();
  const { mutate: createGroup, isPending } = useCreateGroup();

  const handleCreate = () => {
    if (!groupName) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên nhóm');
      return;
    }
    if (!appState?.id) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      return;
    }

    createGroup(
      {
        creatorId: String(appState.id),
        dto: {
          groupName: groupName,
          description: description,
        },
      },
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Tạo nhóm mới thành công!');
          router.back(); // Quay lại màn hình danh sách nhóm
        },
        onError: (err) => {
          Alert.alert('Lỗi', err.message);
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên nhóm</Text>
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Ví dụ: Tiệc liên hoan"
      />

      <Text style={styles.label}>Mô tả (không bắt buộc)</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Mô tả ngắn về nhóm..."
        multiline
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreate}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Tạo nhóm</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: APP_COLOR.ORANGE,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateGroupScreen;