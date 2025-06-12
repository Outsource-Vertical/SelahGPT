import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, Button, View } from 'react-native';
import { saveMonthlyBudget, getMonthlyBudget } from '../services/budget';
import { MonthlyBudget, BudgetCategory } from '../types/MonthlyBudget';
import dayjs from 'dayjs';

const budgetCategories: { [key: string]: string[] } = {
  Children: ['Activities', 'Allowance', 'Medical', 'Childcare', 'Clothing', 'School', 'Toys', 'Other'],
  Debt: ['Credit cards', 'Student loans', 'Other loans', 'Taxes (federal)', 'Taxes (state)', 'Other'],
  Education: ['Tuition', 'Books', 'Music lessons', 'Other'],
  Entertainment: ['Books', 'Concerts/shows', 'Games', 'Hobbies', 'Movies', 'Music', 'Outdoor activities', 'Photography', 'Sports', 'Theater/plays', 'TV', 'Other'],
  Everyday: ['Groceries', 'Restaurants', 'Personal supplies', 'Clothes', 'Laundry/dry cleaning', 'Hair/beauty', 'Subscriptions', 'Other'],
  Gifts: ['Gifts', 'Donations (charity)', 'Other'],
  HealthMedical: ['Doctors/dental/vision', 'Specialty care', 'Pharmacy', 'Emergency', 'Other'],
  Home: ['Rent/mortgage', 'Property taxes', 'Furnishings', 'Lawn/garden', 'Supplies', 'Maintenance', 'Improvements', 'Moving', 'Other'],
  Insurance: ['Car', 'Health', 'Home', 'Life', 'Other'],
  Pets: ['Food', 'Vet/medical', 'Toys', 'Supplies', 'Other'],
  Technology: ['Domains & hosting', 'Online services', 'Hardware', 'Software', 'Other'],
  Transportation: ['Fuel', 'Car payments', 'Repairs', 'Registration/license', 'Supplies', 'Public transit', 'Other'],
  Travel: ['Airfare', 'Hotels', 'Food', 'Transportation', 'Entertainment', 'Other'],
  Utilities: ['Phone', 'TV', 'Internet', 'Electricity', 'Heat/gas', 'Water', 'Trash', 'Other'],
  Other: ['Category 1', 'Category 2'],
};

export default function BudgetEntryScreen({ route }) {
  const user = route.params.user;
  const monthId = dayjs().format('YYYY-MM'); // Default to current month

  const [budget, setBudget] = useState<MonthlyBudget | null>(null);

  useEffect(() => {
    const fetchBudget = async () => {
      const existing = await getMonthlyBudget(user.uid, monthId);
      setBudget(existing || { month: monthId });
    };
    fetchBudget();
  }, []);

  const handleInputChange = (category: string, sub: string, value: string) => {
    const newValue = parseFloat(value) || 0;

    setBudget(prev => {
      const updated = { ...prev };
      const cat = updated?.[category] || {};
      updated[category] = {
        ...cat,
        [sub]: newValue,
      };
      return updated;
    });
  };

  const handleSave = async () => {
    if (budget) {
      await saveMonthlyBudget(user.uid, monthId, budget);
      alert('Budget saved!');
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Monthly Budget – {monthId}</Text>

      {Object.entries(budgetCategories).map(([category, subs]) => (
        <View key={category} style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>{category}</Text>
          {subs.map(sub => (
            <View key={sub} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Text style={{ flex: 1 }}>{sub}</Text>
              <TextInput
                keyboardType="numeric"
                value={(budget?.[category]?.[sub] || '').toString()}
                onChangeText={(text) => handleInputChange(category, sub, text)}
                style={{
                  width: 80,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 6,
                  textAlign: 'right',
                }}
              />
            </View>
          ))}
        </View>
      ))}

      <Button title="Save Budget" onPress={handleSave} />
    </ScrollView>
  );
}
