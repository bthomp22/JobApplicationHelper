import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "./screens/DashboardScreen";
import JobTrackingScreen from "./screens/JobTrackingScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ResumeBuilderScreen from "./screens/ResumeBuilderScreen";
import CoverLetterScreen from "./screens/CoverLetterScreen";
import JobDetailsScreen from "./screens/JobDetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tab.Screen 
        name="Job Tracking" 
        component={JobTrackingScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="briefcase" size={size} color={color} /> }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Resume Builder" component={ResumeBuilderScreen} />
        <Stack.Screen name="Cover Letter" component={CoverLetterScreen} />
        <Stack.Screen name="Job Details" component={JobDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}