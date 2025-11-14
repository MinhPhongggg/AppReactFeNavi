// src/screens/Profile/ProfileScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';

const ProfileScreen = () => {
  const userName = useAuthStore(state => state.userName);
  const role = useAuthStore(state => state.role);
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Huỷ" },
      { text: "Đăng xuất", style: "destructive", onPress: logout }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên:</Text>
      <Text style={styles.value}>{userName || 'N/A'}</Text>
      
      <Text style={styles.label}>Vai trò (Role):</Text>
      <Text style={styles.value}>{role || 'N/A'}</Text>

      <Button title="Đăng xuất" onPress={handleLogout} color="#FF3B30" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  label: { fontSize: 16, color: '#555', marginTop: 20 },
  value: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
});

export default ProfileScreen;