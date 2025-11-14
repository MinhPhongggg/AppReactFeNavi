import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert, // Giữ lại Alert từ code gốc
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore'; // Sử dụng store từ code gốc

// Giao diện (UI) sẽ nhận prop 'navigation' từ code mẫu
export default function RegisterScreen({ navigation }: any) {
  // --- State từ code gốc ---
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- State từ code mẫu (để hiện/ẩn pass) ---
  const [showPwd, setShowPwd] = useState(false);

  // --- Logic store từ code gốc ---
  const register = useAuthStore(state => state.register);
  const status = useAuthStore(state => state.status);
  const isLoading = status === 'loading';

  // --- Hàm xử lý từ code gốc, được tích hợp validation cơ bản ---
  const handleRegister = async () => {
    // Validation cơ bản (thay thế cho Yup)
    if (!userName || !email || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    // Gọi hàm register từ store
    try {
      await register({ userName, email, password });
      // Nếu thành công, listener trong app của bạn sẽ tự động chuyển màn hình
      // Hoặc bạn có thể thêm Alert/navigation tại đây
    } catch (error) {
      Alert.alert('Đăng ký thất bại', 'Email có thể đã được sử dụng.');
    }
  };

  return (
    <View style={styles.screen}>
      {/* HEADER (Giao diện từ code mẫu) */}
      <View style={styles.hero} />
      <Text style={styles.heroText}>
        <Text style={styles.heroBold}>Tạo tài khoản{"\n"}</Text>
        để bắt đầu với <Text style={styles.brand}>SplitFair</Text>
      </Text>

      {/* CARD FORM (Giao diện từ code mẫu) */}
      <View style={styles.card}>
        {/* Loại bỏ Formik, sử dụng state và handler trực tiếp */}
        <>
          {/* Email */}
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={18} color="#9AA0A6" />
            <TextInput
              style={styles.inputFlex}
              placeholder="Email"
              placeholderTextColor="#b0b0b0"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email} // Sử dụng state từ code gốc
              onChangeText={setEmail} // Sử dụng state từ code gốc
            />
          </View>

          {/* Display name (Sử dụng userName từ code gốc) */}
          <View style={[styles.inputRow, { marginTop: 10 }]}>
            <Ionicons name="person-outline" size={18} color="#9AA0A6" />
            <TextInput
              style={styles.inputFlex}
              placeholder="Tên hiển thị (userName)" // Giữ placeholder từ code gốc
              placeholderTextColor="#b0b0b0"
              value={userName} // Sử dụng state từ code gốc
              onChangeText={setUserName} // Sử dụng state từ code gốc
            />
          </View>

          {/* Password */}
          <View style={[styles.inputRow, { marginTop: 10 }]}>
            <Ionicons name="lock-closed-outline" size={18} color="#9AA0A6" />
            <TextInput
              style={styles.inputFlex}
              placeholder="Mật khẩu"
              placeholderTextColor="#b0b0b0"
              secureTextEntry={!showPwd} // Logic từ code mẫu
              value={password} // Sử dụng state từ code gốc
              onChangeText={setPassword} // Sử dụng state từ code gốc
            />
            <TouchableOpacity onPress={() => setShowPwd(s => !s)}>
              <Ionicons
                name={showPwd ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#9AA0A6"
              />
            </TouchableOpacity>
          </View>

          {/* Submit (Sử dụng logic từ code gốc) */}
          <TouchableOpacity
            onPress={handleRegister} // Sử dụng handler từ code gốc
            disabled={isLoading} // Sử dụng state từ code gốc
            activeOpacity={0.9}
            style={[
              styles.primaryBtn,
              isLoading && styles.btnDisabled, // Sử dụng state từ code gốc
            ]}
          >
            {isLoading ? ( // Sử dụng state từ code gốc
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>Tạo tài khoản</Text>
            )}
          </TouchableOpacity>

          {/* Link đăng nhập (Giao diện từ code mẫu) */}
          <View style={{ alignItems: "center", marginTop: 16 }}>
            <Text style={{ color: "#111" }}>
              Đã có tài khoản?{" "}
              <Text
                style={styles.signup}
                onPress={() => navigation.navigate("Login")}
              >
                Đăng nhập
              </Text>
            </Text>
          </View>
        </>
      </View>
    </View>
  );
}

// --- Stylesheet (Lấy từ code mẫu) ---
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  hero: {
    height: 220,
    backgroundColor: "#ff922b",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroText: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    color: "#fff",
    fontSize: 28,
    lineHeight: 32,
  },
  heroBold: { fontWeight: "900", color: "#fff" },
  brand: { fontWeight: "900", color: "#fff" },

  card: {
    marginHorizontal: 18,
    marginTop: -40,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1, borderColor: "#e6e6e6",
    borderRadius: 12, backgroundColor: "#fff",
    paddingHorizontal: 12, height: 48,
  },
  inputFlex: { flex: 1, marginLeft: 8, color: "#111" },
  err: { color: "#ef4444", marginTop: 6, marginBottom: 4 }, // (Style này không dùng do đã bỏ Formik)

  primaryBtn: {
    marginTop: 14,
    backgroundColor: "#ff922b",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  btnDisabled: { opacity: 0.7 },

  signup: { color: "#ff922b", fontWeight: "800" },
});