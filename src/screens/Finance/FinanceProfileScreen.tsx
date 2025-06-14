import React, { useEffect, useState } from "react";
import { ScrollView, Text, Button } from "react-native";
import { getFinanceProfile } from "@services/finance";

export default function FinanceProfileScreen({ navigation, route }) {
  const user = route.params.user;
  const [profile, setProfile] = useState<FinanceProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getFinanceProfile(user.uid);
      setProfile(result);
    };
    fetchData();
  }, [user]);

  if (!profile) return <Text>Loading...</Text>;

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Finance Profile</Text>

      <Text>Income Type: {profile.incomeType}</Text>
      <Text>Budget Style: {profile.budgetStyle}</Text>
      <Text>Uses Budget App: {profile.usesBudgetApp ? "Yes" : "No"}</Text>
      <Text>Giving Style: {profile.givingStyle}</Text>
      <Text>Money Mindset: {profile.moneyMindset}</Text>
      <Text>
        Wants Scripture Advice:{" "}
        {profile.wantsScriptureFinancialAdvice ? "Yes" : "No"}
      </Text>

      {profile.spiritualViewOnMoney && (
        <Text>Spiritual View on Money: {profile.spiritualViewOnMoney}</Text>
      )}

      {profile.financialGoals?.length > 0 && (
        <Text>Goals: {profile.financialGoals.join(", ")}</Text>
      )}

      {profile.financialStressors?.length > 0 && (
        <Text>Stressors: {profile.financialStressors.join(", ")}</Text>
      )}

      <Button
        title="Edit Finance Profile"
        onPress={() =>
          navigation.navigate("EditFinanceProfile", {
            user,
            profile,
          })
        }
      />

      <Button
        title="Manage Budget"
        onPress={() => navigation.navigate("BudgetEntry", { user })}
      />

      <Button
        title="View Budget Chart"
        onPress={() => navigation.navigate("BudgetPieChart", { user })}
      />
    </ScrollView>
  );
}
