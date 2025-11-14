// src/navigation/stacks/ProfileStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountScreen from '@/screens/Auth/AccountScreen';

// import EditProfileScreen from '@/screens/Profile/EditProfileScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  // EditProfile: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={AccountScreen}
        options={{ title: 'Cá nhân' }}
      />
      {/* <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Chỉnh sửa hồ sơ' }}
      /> 
      */}
    </Stack.Navigator>
  );
};