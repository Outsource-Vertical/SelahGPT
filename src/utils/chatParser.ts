export function parseProfileUpdate(text: string) {
  const lower = text.toLowerCase();

  // 🏋️ FITNESS
  if (lower.includes('weight')) {
    const match = text.match(/(\d{2,3}(\.\d+)?)/);
    const weight = match ? parseFloat(match[0]) : null;

    if (weight) {
      return {
        module: 'fitness',
        field: lower.includes('target') ? 'targetWeight' : 'currentWeight',
        value: weight,
      };
    }
  }

  if (lower.includes('height')) {
    const match = text.match(/(\d{2,3}(\.\d+)?)/);
    const height = match ? match[0] : null;

    if (height) {
      return {
        module: 'fitness',
        field: 'height',
        value: height,
      };
    }
  }

  // 🛐 FAITH
  if (lower.includes('prayer')) {
    if (lower.includes('daily') || lower.includes('every day')) {
      return {
        module: 'faith',
        field: 'prayerHabit',
        value: 'daily',
      };
    }
    if (lower.includes('weekly')) {
      return {
        module: 'faith',
        field: 'prayerHabit',
        value: 'weekly',
      };
    }
  }

  // 💰 FINANCE
  if (lower.includes('income')) {
    const match = text.match(/\$?(\d{3,6})/);
    const income = match ? parseInt(match[1]) : null;

    if (income) {
      return {
        module: 'finance',
        field: 'monthlyIncome',
        value: income,
      };
    }
  }

  // 🎯 GOALS
  if (lower.includes('goal')) {
    const match = text.match(/goal (is|as)? (.+)/i);
    const goalText = match ? match[2]?.trim() : null;

    if (goalText) {
      return {
        module: 'goals',
        field: 'topGoal',
        value: goalText,
      };
    }
  }

  // ❤️ HEALTH
  if (lower.includes('sleep')) {
    const match = text.match(/(\d+)\s*(hours|hrs)/);
    const sleep = match ? parseInt(match[1]) : null;

    if (sleep) {
      return {
        module: 'health',
        field: 'hoursOfSleep',
        value: sleep,
      };
    }
  }

  // ❌ Nothing matched
  return null;
}
