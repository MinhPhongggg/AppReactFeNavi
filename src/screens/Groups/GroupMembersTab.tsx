// src/screens/Groups/GroupMembersTab.tsx
import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { useGroupDetail } from '@/api/hooks';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from '@/navigation/stacks/GroupStack';

type Nav = NativeStackNavigationProp<GroupStackParamList>;

const GroupMembersTab = ({ groupId }: { groupId: string }) => {
  const navigation = useNavigation<Nav>();
  const { data: groupData, isLoading } = useGroupDetail(groupId);

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <FlatList
      data={groupData?.members || []}
      keyExtractor={(item) => item.id}
      // Nút "Thêm thành viên" ở đầu danh sách
      ListHeaderComponent={() => (
        <Button 
          title="+ Thêm thành viên"
          onPress={() => navigation.navigate('AddMember', { groupId })}
        />
      )}
      renderItem={({ item }) => (
        <View style={styles.row}>
          {/* (Icon ở đây) */}
          <View>
            <Text style={styles.name}>{item.userName}</Text>
            <Text style={styles.role}>{item.roleName}</Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontSize: 16, fontWeight: 'bold' },
  role: { fontSize: 14, color: 'gray' },
});

export default GroupMembersTab;