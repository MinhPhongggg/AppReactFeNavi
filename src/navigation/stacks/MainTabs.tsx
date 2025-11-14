// src/navigation/stacks/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GroupStack } from './GroupStack';
import ProfileScreen from '@/screens/Auth/AccountScreen'; // Dùng screen trực tiếp

export type MainTabsParamList = {
  GroupTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="GroupTab"
        component={GroupStack}
        options={{ title: 'Nhóm' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen} // Dùng screen đơn giản
        options={{ title: 'Cá nhân', headerShown: true }} // Cho hiện Title
      />
    </Tab.Navigator>
  );
};