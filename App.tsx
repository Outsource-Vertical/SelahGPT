import 'react-native-gesture-handler';
import './firebase';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import Purchases from 'react-native-purchases';

import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import AccountScreen from './screens/AccountScreen';
import UpgradeScreen from './screens/UpgradeScreen';
import FitnessProfileScreen from './screens/FitnessProfileScreen';
import EditFitnessProfileScreen from './screens/EditFitnessProfileScreen';
import FaithProfileScreen from './screens/FaithProfileScreen';
import EditFaithProfileScreen from './screens/EditFaithProfileScreen';
import FinanceProfileScreen from './screens/FinanceProfileScreen';
import EditFinanceProfileScreen from './screens/EditFinanceProfileScreen';
import BudgetPieChartScreen from './screens/BudgetPieChartScreen';
import BudgetEntryScreen from './screens/BudgetEntryScreen';
import HealthProfileScreen from './screens/HealthProfileScreen';
import EditHealthProfileScreen from './screens/EditHealthProfileScreen';
import FamilyProfileScreen from './screens/FamilyProfileScreen';
import EditFamilyProfileScreen from './screens/EditFamilyProfileScreen';
import HeaderMenu from './components/HeaderMenu';


// ✅ Make sure this path is correct
import headerMenu from './components/HeaderMenu';

const REVENUECAT_API_KEY = Platform.select({
  ios: 'your_ios_key_here',
  android: 'your_android_key_here',
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
          <Stack.Screen name="FitnessProfile" component={FitnessProfileScreen} />
          <Stack.Screen name="EditFitnessProfile" component={EditFitnessProfileScreen} />
          <Stack.Screen name="FaithProfile" component={FaithProfileScreen} />
          <Stack.Screen name="EditFaithProfile" component={EditFaithProfileScreen} />
          <Stack.Screen name="BudgetPieChart" component={BudgetPieChartScreen} />
          <Stack.Screen name="FinanceProfile" component={FinanceProfileScreen} />
          <Stack.Screen name="EditFinanceProfile" component={EditFinanceProfileScreen} />
          <Stack.Screen name="BudgetEntry" component={BudgetEntryScreen} />
          <Stack.Screen name="HealthProfile" component={HealthProfileScreen} />
          <Stack.Screen name="EditHealthProfile" component={EditHealthProfileScreen} />
          <Stack.Screen name="FamilyProfile" component={FamilyProfileScreen} />
          <Stack.Screen name="EditFamilyProfile" component={EditFamilyProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
