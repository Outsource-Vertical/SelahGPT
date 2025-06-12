import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { getMonthlyBudget } from '../services/budget';
import { getBudgetFeedback } from '../utils/analyzeBudget';
import dayjs from 'dayjs';

const screenWidth = Dimensions.get('window').width;

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function BudgetPieChartScreen({ route }) {
  const user = route.params.user;
  const monthId = dayjs().format('YYYY-MM');

  const [chartData, setChartData] = useState([]);
  const [budget, setBudget] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchBudgetAndAnalyze = async () => {
      const monthlyBudget = await getMonthlyBudget(user.uid, monthId);
      if (!monthlyBudget) return;

      setBudget(monthlyBudget);

      const pieData = [];

      Object.entries(monthlyBudget).forEach(([category, subs]) => {
        if (['month', 'updatedAt'].includes(category)) return;

        const total = Object.values(subs).reduce((sum, val) => sum + parseFloat(val || 0), 0);

        if (total > 0) {
          pieData.push({
            name: category,
            population: total,
            color: getRandomColor(),
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          });
        }
      });

      setChartData(pieData);

      const feedbackText = getBudgetFeedback(monthlyBudget);
      setFeedback(feedbackText);
    };

    fetchBudgetAndAnalyze();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Monthly Budget Breakdown</Text>

      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: () => '#000000',
            labelColor: () => '#000',
            decimalPlaces: 2,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="16"
          absolute
        />
      ) : (
        <Text style={styles.loading}>No budget data available.</Text>
      )}

      {feedback && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>Analysis</Text>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  loading: {
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
  feedbackContainer: {
    marginTop: 32,
    paddingHorizontal: 8,
    width: '100%',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});
