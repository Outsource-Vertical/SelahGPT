import "react-native-gesture-handler";
import "./services/firebase";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";

import Purchases from "react-native-purchases";

// Screens
import LoginScreen from "./screens/Auth/LoginScreen";
import SignupScreen from "./screens/Auth/SignupScreen";
import UpgradeScreen from "./screens/Auth/UpgradeScreen";

import BudgetEntryScreen from "./screens/Finance/Budget/BudgetEntryScreen";
import BudgetPieChartScreen from "./screens/Finance/Budget/BudgetPieChartScreen";

import ChatScreen from "./screens/Chat/ChatScreen";

import FaithProfileScreen from "./screens/Faith/FaithProfileScreen";
import EditFaithProfileScreen from "./screens/Faith/EditFaithProfileScreen";

import FamilyProfileScreen from "./screens/Family/FamilyProfileScreen";
import EditFamilyProfileScreen from "./screens/Family/EditFamilyProfileScreen";

import FinanceProfileScreen from "./screens/Finance/FinanceProfileScreen";
import EditFinanceProfileScreen from "./screens/Finance/EditFinanceProfileScreen";

import FitnessProfileScreen from "./screens/Fitness/FitnessProfileScreen";
import EditFitnessProfileScreen from "./screens/Fitness/EditFitnessProfileScreen";

import HealthProfileScreen from "./screens/Health/HealthProfileScreen";
import EditHealthProfileScreen from "./screens/Health/EditHealthProfileScreen";

import AccountScreen from "./screens/Other/AccountScreen";
import HomeScreen from "./screens/Other/HomeScreen";

import ProfileScreen from "./screens/Profile/ProfileScreen";

import HeaderMenu from "./components/HeaderMenu";

const REVENUECAT_API_KEY = Platform.select({
  ios: "your_ios_key_here",
  android: "your_android_key_here",
});

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Signup"
          screenOptions={{
            headerRight: () => <HeaderMenu />,
          }}
        >
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Account" component={AccountScreen} />
          <Stack.Screen name="Upgrade" component={UpgradeScreen} />
          <Stack.Screen
            name="FitnessProfile"
            component={FitnessProfileScreen}
          />
          <Stack.Screen
            name="EditFitnessProfile"
            component={EditFitnessProfileScreen}
          />
          <Stack.Screen name="FaithProfile" component={FaithProfileScreen} />
          <Stack.Screen
            name="EditFaithProfile"
            component={EditFaithProfileScreen}
          />
          <Stack.Screen
            name="BudgetPieChart"
            component={BudgetPieChartScreen}
          />
          <Stack.Screen
            name="FinanceProfile"
            component={FinanceProfileScreen}
          />
          <Stack.Screen
            name="EditFinanceProfile"
            component={EditFinanceProfileScreen}
          />
          <Stack.Screen name="BudgetEntry" component={BudgetEntryScreen} />
          <Stack.Screen name="HealthProfile" component={HealthProfileScreen} />
          <Stack.Screen
            name="EditHealthProfile"
            component={EditHealthProfileScreen}
          />
          <Stack.Screen name="FamilyProfile" component={FamilyProfileScreen} />
          <Stack.Screen
            name="EditFamilyProfile"
            component={EditFamilyProfileScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
