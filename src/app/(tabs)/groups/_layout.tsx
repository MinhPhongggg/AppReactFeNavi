// splitapp-fe/src/app/(tabs)/groups/_layout.tsx
import { Stack } from 'expo-router';
import { APP_COLOR } from '@/utils/constant'; // Import màu của app mới

export default function GroupStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: APP_COLOR.ORANGE }, // Dùng màu cam
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Nhóm Của Bạn' }} />
      <Stack.Screen name="create-group" options={{ title: 'Tạo Nhóm Mới' }} />
      <Stack.Screen name="[groupId]" options={{ title: 'Chi Tiết Nhóm' }} />
      <Stack.Screen name="add-member" options={{ title: 'Thêm Thành Viên' }} />
      <Stack.Screen name="create-bill" options={{ title: 'Tạo Hóa Đơn' }} />
      <Stack.Screen name="bill/[billId]" options={{ title: 'Chi Tiết Hóa Đơn' }} />
      <Stack.Screen name="create-expense" options={{ title: 'Tạo Chi Tiêu' }} />
    </Stack>
  );
}