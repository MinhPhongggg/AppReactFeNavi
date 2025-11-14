// src/app/(tabs)/groups/create-bill.tsx
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
import { router, useLocalSearchParams } from 'expo-router';
import { APP_COLOR } from '@/utils/constant';
import { useCreateBill, useGetCategories } from '@/api/hooks';
import { useCurrentApp } from '@/context/app.context';
// Bạn cần tạo component Picker (hoặc dùng thư viện)
// import SelectDropdown from 'react-native-select-dropdown'; 

const CreateBillScreen = () => {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { appState } = useCurrentApp();

  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const { data: categories } = useGetCategories();
  const { mutate: createBill, isPending } = useCreateBill(groupId as string);

  const handleCreate = () => {
    if (!description || !totalAmount || !categoryId) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    createBill(
      {
        groupId: groupId as string,
        createdBy: appState?.id ? String(appState.id) : undefined, // Lấy ID người tạo
        description,
        totalAmount: parseFloat(totalAmount),
        categoryId,
        currency: 'VND', // Mặc định
        status: 'DRAFT', // Mặc định
      },
      {
        onSuccess: (newBill) => {
          Alert.alert('Thành công', 'Đã tạo hóa đơn mới.');
          // Chuyển sang màn hình chi tiết bill để thêm expense
          router.replace(`/(tabs)/groups/bill/${newBill.id}`);
        },
        onError: (err) => {
          Alert.alert('Lỗi', err.message);
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mô tả hóa đơn</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Ví dụ: Ăn tối nhà hàng"
      />

      <Text style={styles.label}>Tổng số tiền</Text>
      <TextInput
        style={styles.input}
        value={totalAmount}
        onChangeText={setTotalAmount}
        placeholder="Ví dụ: 500000"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Danh mục</Text>
      {/* Đây là nơi bạn nên dùng Picker/Dropdown
        Ví dụ đơn giản:
      */}
      {categories?.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[
            styles.category,
            categoryId === cat.id && styles.categorySelected,
          ]}
          onPress={() => setCategoryId(cat.id)}
        >
          <Text>{cat.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreate}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Tạo Hóa Đơn</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
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
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  category: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginTop: 5,
  },
  categorySelected: {
    borderColor: APP_COLOR.ORANGE,
    backgroundColor: '#FFF5EE',
  },
});

export default CreateBillScreen;