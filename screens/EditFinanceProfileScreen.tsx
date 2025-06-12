import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Button, Switch } from 'react-native';
import { saveFinanceProfile } from '../services/finance';

export default function EditFinanceProfileScreen({ route, navigation }) {
  const { user, profile } = route.params;

  const [incomeType, setIncomeType] = useState(profile.incomeType || 'salary');
  const [budgetStyle, setBudgetStyle] = useState(profile.budgetStyle || 'zero-based');
  const [usesBudgetApp, setUsesBudgetApp] = useState(profile.usesBudgetApp || false);
  const [givingStyle, setGivingStyle] = useState(profile.givingStyle || '');
  const [moneyMindset, setMoneyMindset] = useState(profile.moneyMindset || '');
  const [spiritualViewOnMoney, setSpiritualViewOnMoney] = useState(profile.spiritualViewOnMoney || '');
  const [wantsScriptureFinancialAdvice, setWantsScriptureFinancialAdvice] = useState(profile.wantsScriptureFinancialAdvice || false);
  const [financialGoals, setFinancialGoals] = useState(profile.financialGoals?.join(', ') || '');
  const [financialStressors, setFinancialStressors] = useState(profile.financialStressors?.join(', ') || '');

  const handleSave = async () => {
    await saveFinanceProfile(user.uid, {
      incomeType,
      budgetStyle,
      usesBudgetApp,
      givingStyle,
      moneyMindset,
      spiritualViewOnMoney,
      wantsScriptureFinancialAdvice,
      financialGoals: financialGoals.split(',').map(str => str.trim()),
      financialStressors: financialStressors.split(',').map(str => str.trim()),
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Edit Finance Profile</Text>

      <Text>Income Type</Text>
      <TextInput value={incomeType} onChangeText={setIncomeType} style={inputStyle} />

      <Text>Budget Style</Text>
      <TextInput value={budgetStyle} onChangeText={setBudgetStyle} style={inputStyle} />

      <Text>Giving Style</Text>
      <TextInput value={givingStyle} onChangeText={setGivingStyle} style={inputStyle} />

      <Text>Money Mindset</Text>
      <TextInput value={moneyMindset} onChangeText={setMoneyMindset} style={inputStyle} />

      <Text>Spiritual View on Money</Text>
      <TextInput value={spiritualViewOnMoney} onChangeText={setSpiritualViewOnMoney} style={inputStyle} />

      <Text>Goals (comma-separated)</Text>
      <TextInput value={financialGoals} onChangeText={setFinancialGoals} style={inputStyle} />

      <Text>Stressors (comma-separated)</Text>
      <TextInput value={financialStressors} onChangeText={setFinancialStressors} style={inputStyle} />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
        <Text style={{ flex: 1 }}>Uses Budget App</Text>
        <Switch value={usesBudgetApp} onValueChange={setUsesBudgetApp} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ flex: 1 }}>Wants Scripture Advice</Text>
        <Switch value={wantsScriptureFinancialAdvice} onValueChange={setWantsScriptureFinancialAdvice} />
      </View>

      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 8,
  marginBottom: 12,
};
