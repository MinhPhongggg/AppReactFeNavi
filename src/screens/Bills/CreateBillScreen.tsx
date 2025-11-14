// src/screens/Groups/CreateBillScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useCreateBill, useCategories } from '@/api/hooks'; // <-- THÊM useCategories
import { useAuthStore } from '@/store/authStore';
import { GroupStackParamList } from '@/navigation/stacks/GroupStack';
import { Picker } from '@react-native-picker/picker'; // <-- THÊM

type Route = RouteProp<GroupStackParamList, 'CreateBill'>;

const CreateBillScreen = () => {
  const navigation = useNavigation();
  const { groupId } = useRoute<Route>().params;
  const [description, setDescription] = useState('');
  
  // --- THAY ĐỔI ---
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  // --- KẾT THÚC THAY ĐỔI ---

  const creatorId = useAuthStore(state => state.userId);
  const { mutate: createBill, isPending: isCreatingBill } = useCreateBill(groupId);

  const handleCreate = () => {
    // --- THAY ĐỔI ---
    if (!description || !selectedCategory) {
      Alert.alert('Lỗi', 'Vui lòng nhập mô tả VÀ chọn danh mục');
      return;
    }
    // --- KẾT THÚC THAY ĐỔI ---

    if (!creatorId) {
      Alert.alert('Lỗi', 'Lỗi người dùng, vui lòng đăng nhập lại.');
      return;
    }
    
    createBill({
      description: description,
      groupId: groupId,
      createdBy: creatorId,
      currency: 'VND', 
      categoryId: selectedCategory, // <-- THÊM TRƯỜNG BỊ THIẾU
    }, {
      onSuccess: () => {
        navigation.goBack();
      },
      onError: (err) => {
        Alert.alert('Lỗi', 'Không thể tạo Bill: ' + err.message);
      }
    });
  };

  if (isLoadingCategories) {
    return <ActivityIndicator />; // Chờ tải danh mục
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mô tả Hóa đơn</Text>
      <TextInput
        style={styles.input}
        placeholder="VD: Ăn tối nhà hàng X"
        value={description}
        onChangeText={setDescription}
      />
      
      {/* --- THÊM PICKER --- */}
      <Text style={styles.label}>Danh mục</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="-- Chọn một danh mục --" value={undefined} />
          {categories?.map((cat) => (
            <Picker.Item label={cat.name} value={cat.id} key={cat.id} />
          ))}
        </Picker>
      </View>
      {/* --- KẾT THÚC PICKER --- */}

      {isCreatingBill ? (
        <ActivityIndicator />
      ) : (
        <Button title="Tạo Hóa đơn" onPress={handleCreate} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5, marginTop: 5 },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 5,
  }
});
export default CreateBillScreen;