// src/screens/Groups/AddMemberScreen.tsx
import React, { useState } from 'react';
import { 
  View, Text, FlatList, ActivityIndicator, TouchableOpacity, 
  StyleSheet, Alert, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { GroupStackParamList } from '@/navigation/stacks/GroupStack';
import { useUserSearch, useAddMember } from '@/api/hooks'; // <-- Dùng hook search
import { UserDTO } from '@/types/user.types';

type Route = RouteProp<GroupStackParamList, 'AddMember'>;

const AddMemberScreen = () => {
  const navigation = useNavigation();
  const { groupId } = useRoute<Route>().params;
  
  const [query, setQuery] = useState(''); // State cho ô tìm kiếm
  
  // 1. Gọi hook search (sẽ tự chạy khi 'query.length > 1')
  const { data: users, isLoading: isLoadingSearch } = useUserSearch(query);
  
  // 2. Hook để thêm thành viên (khi bấm nút)
  const { mutate: addMember, isPending: isAdding } = useAddMember(groupId);

  const handleAddMember = (user: UserDTO) => {
    //
    addMember({ userId: user.id }, {
      onSuccess: () => {
        Alert.alert("Thành công", `Đã thêm ${user.name} vào nhóm.`);
        navigation.goBack();
      },
      onError: (err) => {
        //
        // Bắt lỗi BE nếu "User already in this group"
        Alert.alert("Lỗi", (err as Error).message || "Không thể thêm thành viên");
      }
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Thêm thành viên</Text>
      <Text style={styles.subtitle}>Nhập email hoặc tên để tìm</Text>
      
      {/* 3. Ô TÌM KIẾM */}
      <TextInput
        style={styles.input}
        placeholder="vd: alice@demo.com"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />
      
      {/* 4. DANH SÁCH KẾT QUẢ */}
      {isLoadingSearch && <ActivityIndicator />}
      
      <FlatList
        data={users || []}
        keyExtractor={(item) => item.id}
        // Hiển thị nếu không gõ gì hoặc gõ < 2 ký tự
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            {query.length < 2 ? "Nhập ≥ 2 ký tự để tìm" : "Không tìm thấy kết quả"}
          </Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.row} 
            onPress={() => handleAddMember(item)}
            disabled={isAdding} // Vô hiệu hóa nếu đang thêm
          >
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            {isAdding && <ActivityIndicator />}
          </TouchableOpacity>
        )}
      />
    </KeyboardAvoidingView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
});

export default AddMemberScreen;