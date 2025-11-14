// src/screens/Expense/CreateExpenseScreen.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, Button, Alert, ActivityIndicator,
  StyleSheet, Switch, FlatList, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from '@/navigation/stacks/GroupStack';
import { useCreateExpense, useSaveShares, useGroupDetail } from '@/api/hooks';
import { useAuthStore } from '@/store/authStore';
import { Picker } from '@react-native-picker/picker';
import { ShareInput } from '@/types/expense.types';
import { GroupMemberDTO } from '@/types/group.types';

type Route = RouteProp<GroupStackParamList, 'CreateExpense'>;
type Nav = NativeStackNavigationProp<GroupStackParamList, 'CreateExpense'>;

// Định nghĩa các kiểu chia
type SplitType = 'equal' | 'exact' | 'percent' | 'portion';

interface Participant extends GroupMemberDTO {
  isSelected: boolean;
  amountToPay: number; // Số tiền được tính toán
  customValue: string; // Giá trị (%, 1.5 phần, 50000VND) do user nhập
}

// Hàm làm tròn để tránh lỗi JavaScript
const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

const CreateExpenseScreen = () => {
  const navigation = useNavigation<Nav>();
  const { billId, groupId } = useRoute<Route>().params;
  const currentUserId = useAuthStore(state => state.userId);
  
  // 1. Tải member
  const { data: groupData, isLoading: isLoadingGroup } = useGroupDetail(groupId);

  // 2. State cho Form
  const [description, setDescription] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [splitType, setSplitType] = useState<SplitType>('equal');
  
  // 3. State cho danh sách người tham gia
  const [participants, setParticipants] = useState<Participant[]>([]);

  // 4. Hooks API
  const { mutateAsync: createExpense, isPending: isCreatingExpense } = useCreateExpense(billId);
  const { mutateAsync: saveShares, isPending: isSavingShares } = useSaveShares();
  
  // 5. Khởi tạo state participants khi tải xong member
  useEffect(() => {
    if (groupData?.members) {
      setParticipants(
        groupData.members.map(m => ({
          ...m,
          isSelected: true,
          amountToPay: 0,
          customValue: '0', // Giá trị (%, $, phần)
        }))
      );
      if (currentUserId) setPaidBy(currentUserId);
    }
  }, [groupData, currentUserId]);

  // 6. "BỘ NÃO" TÍNH TOÁN - Tự động cập nhật số tiền
  useMemo(() => {
    const numAmount = parseFloat(amountStr) || 0;
    const selectedParticipants = participants.filter(p => p.isSelected);
    const selectedCount = selectedParticipants.length;

    if (numAmount === 0 || selectedCount === 0) {
      setParticipants(ps => ps.map(p => ({ ...p, amountToPay: 0 })));
      return;
    }

    let newParticipants = [...participants];

    if (splitType === 'equal') {
      const splitAmount = round(numAmount / selectedCount);
      newParticipants = newParticipants.map(p => ({
        ...p,
        amountToPay: p.isSelected ? splitAmount : 0,
      }));
    } 
    else if (splitType === 'exact') {
      newParticipants = newParticipants.map(p => ({
        ...p,
        amountToPay: p.isSelected ? (parseFloat(p.customValue) || 0) : 0,
      }));
    } 
    else if (splitType === 'percent') {
      newParticipants = newParticipants.map(p => ({
        ...p,
        amountToPay: p.isSelected ? round(numAmount * (parseFloat(p.customValue) || 0) / 100) : 0,
      }));
    } 
    else if (splitType === 'portion') {
      const totalPortions = selectedParticipants.reduce((sum, p) => sum + (parseFloat(p.customValue) || 0), 0);
      if (totalPortions === 0) {
        newParticipants = newParticipants.map(p => ({ ...p, amountToPay: 0 }));
      } else {
        const amountPerPortion = numAmount / totalPortions;
        newParticipants = newParticipants.map(p => ({
          ...p,
          amountToPay: p.isSelected ? round(amountPerPortion * (parseFloat(p.customValue) || 0)) : 0,
        }));
      }
    }

    setParticipants(newParticipants);

  }, [amountStr, splitType, participants.map(p => `${p.isSelected}:${p.customValue}`).join(',')]);

  // 7. Hàm cập nhật giá trị (%, $, phần)
  const handleCustomValueChange = (userId: string, value: string) => {
    setParticipants(prev =>
      prev.map(p => 
        p.userId === userId ? { ...p, customValue: value } : p
      )
    );
  };
  
  // 8. Hàm bật/tắt thành viên
  const toggleParticipant = (userId: string) => {
    setParticipants(prev =>
      prev.map(p => 
        p.userId === userId ? { ...p, isSelected: !p.isSelected } : p
      )
    );
  };

  // 9. Hàm LƯU (Gọi 2 API)
  const handleSave = async () => {
    const numAmount = parseFloat(amountStr) || 0;
    const selectedParticipants = participants.filter(p => p.isSelected);
    
    if (!description || numAmount <= 0 || !paidBy || !currentUserId || selectedParticipants.length === 0) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ thông tin và chọn ít nhất 1 người chia.");
      return;
    }

    // --- KIỂM TRA TÍNH HỢP LỆ ---
    const totalShareAmount = round(selectedParticipants.reduce((sum, p) => sum + p.amountToPay, 0));
    
    // Kiểm tra tổng chia (cho phép sai số 1 VND)
    if (Math.abs(totalShareAmount - numAmount) > 1) {
       Alert.alert("Lỗi chia tiền", `Tổng chia (${totalShareAmount}) không khớp với tổng tiền (${numAmount}).`);
       return;
    }
    
    if (splitType === 'percent') {
      const totalPercent = selectedParticipants.reduce((sum, p) => sum + (parseFloat(p.customValue) || 0), 0);
      if (totalPercent !== 100) {
        Alert.alert("Lỗi chia %", `Tổng % (${totalPercent}) phải bằng 100.`);
        return;
      }
    }
    // --- KẾT THÚC KIỂM TRA ---

    try {
      // ---- API 1: TẠO EXPENSE ----
      //
      const newExpense = await createExpense({
        billId: billId,
        paidBy: paidBy,
        createdBy: currentUserId,
        userId: currentUserId,
        description: description,
        amount: numAmount,
        status: 'PENDING',
      });

      // ---- API 2: LƯU PHẦN CHIA (Tạo Debt) ----
      //
      const shares: ShareInput[] = selectedParticipants.map(p => ({
        userId: p.userId,
        // Gửi 3 giá trị, BE sẽ dùng cái nó cần
        percentage: (splitType === 'percent') ? parseFloat(p.customValue || '0') : (p.amountToPay / numAmount) * 100,
        shareAmount: p.amountToPay,
        portion: (splitType === 'portion') ? parseInt(p.customValue || '0') : undefined,
      }));
      
      //
      await saveShares({
        expenseId: newExpense.id,
        totalAmount: numAmount,
        currency: 'VND', // Tạm thời
        paidBy: paidBy,
        shares: shares,
      });

      Alert.alert("Thành công", "Đã tạo và chia chi phí!");
      navigation.goBack(); // Quay về màn hình BillDetail

    } catch (err) {
      Alert.alert("Lỗi nghiêm trọng", "Không thể lưu: " + (err as Error).message);
    }
  };

  // --- Render (Phần Form) ---
  const renderFormHeader = () => (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={styles.input}
        placeholder="VD: Cà phê, Bánh mì..."
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Số tiền</Text>
      <TextInput
        style={styles.input}
        placeholder="0"
        value={amountStr}
        onChangeText={setAmountStr}
        keyboardType="numeric"
      />
      
      <Text style={styles.label}>Người trả tiền</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={paidBy}
          onValueChange={(itemValue) => setPaidBy(itemValue)}
        >
          {groupData?.members.map((mem) => (
            <Picker.Item label={mem.userName} value={mem.userId} key={mem.userId} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Kiểu chia</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={splitType}
          onValueChange={(itemValue: SplitType) => setSplitType(itemValue)}
        >
          <Picker.Item label="Chia đều" value="equal" />
          <Picker.Item label="Chia theo số tiền" value="exact" />
          <Picker.Item label="Chia theo %" value="percent" />
          <Picker.Item label="Chia theo phần" value="portion" />
        </Picker>
      </View>
      <Text style={styles.label}>Chia cho ai?</Text>
    </View>
  );

  // --- Render (Từng dòng thành viên) ---
  const renderParticipantItem = ({ item }: { item: Participant }) => {
    let inputPlaceholder = "VND"; // Cho 'exact'
    if (splitType === 'percent') inputPlaceholder = "%";
    if (splitType === 'portion') inputPlaceholder = "Phần";
    
    return (
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Switch
            value={item.isSelected}
            onValueChange={() => toggleParticipant(item.userId)}
          />
          <Text style={styles.memberName}>{item.userName}</Text>
        </View>
        <View style={styles.rowRight}>
          {/* Ẩn TextInput nếu là 'Chia đều' */}
          {splitType !== 'equal' && (
            <TextInput
              style={styles.splitInput}
              placeholder={inputPlaceholder}
              value={item.customValue}
              onChangeText={(text) => handleCustomValueChange(item.userId, text)}
              keyboardType="numeric"
              // Tắt input nếu không được chọn
              editable={item.isSelected} 
            />
          )}
          <Text style={styles.amountText}>
            {item.amountToPay.toFixed(0)} VND
          </Text>
        </View>
      </View>
    );
  };

  // --- Render chính ---
  if (isLoadingGroup) {
    return <ActivityIndicator style={styles.centered} />;
  }
  
  const isLoading = isCreatingExpense || isSavingShares;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1}}
    >
      <FlatList
        style={styles.container}
        data={participants}
        keyExtractor={(item) => item.userId}
        ListHeaderComponent={renderFormHeader}
        renderItem={renderParticipantItem}
        ListFooterComponent={(
          <View style={{ marginVertical: 40, paddingHorizontal: 20 }}>
            {isLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              <Button title="Lưu chi phí" onPress={handleSave} />
            )}
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1 },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { 
    height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, 
    padding: 10, borderRadius: 5, marginTop: 5, fontSize: 16,
  },
  pickerContainer: { 
    borderColor: 'gray', borderWidth: 1, borderRadius: 5, 
    marginBottom: 15, marginTop: 5, justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 20,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Cho phép co dãn
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 16,
    marginLeft: 10,
    flexShrink: 1, // Cho phép tên co lại nếu quá dài
  },
  splitInput: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    width: 60,
    textAlign: 'right',
    fontSize: 16,
  },
  amountText: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 10,
    minWidth: 70,
    textAlign: 'right',
  }
});

export default CreateExpenseScreen;