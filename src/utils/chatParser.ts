type ProfileUpdate = {
  module: string;
  field: string;
  value: string | number;
};

type FieldParser = {
  field: string;
  patterns: RegExp[];
  valueExtractor: (match: RegExpMatchArray, text: string) => string | number;
};

type ModuleParsers = Record<string, FieldParser[]>;

const MODULE_PARSERS: ModuleParsers = {
  fitness: [
    {
      field: "currentWeight",
      patterns: [
        /current.*weight.*?(\d{2,3}(\.\d+)?)/i,
        /weight.*is.*?(\d{2,3}(\.\d+)?)/i,
      ],
      valueExtractor: (m) => parseFloat(m[1]),
    },
    {
      field: "targetWeight",
      patterns: [/target.*weight.*?(\d{2,3}(\.\d+)?)/i],
      valueExtractor: (m) => parseFloat(m[1]),
    },
    {
      field: "height",
      patterns: [/height.*?(\d{2,3}(\.\d+)?)/i],
      valueExtractor: (m) => parseFloat(m[1]),
    },
    {
      field: "exerciseHabit",
      patterns: [/exercise.*daily/i, /workout.*daily/i],
      valueExtractor: () => "daily",
    },
    {
      field: "exerciseHabit",
      patterns: [/exercise.*weekly/i, /workout.*weekly/i],
      valueExtractor: () => "weekly",
    },
  ],
  faith: [
    {
      field: "prayerHabit",
      patterns: [/pray.*daily/i, /prayer.*daily/i],
      valueExtractor: () => "daily",
    },
    {
      field: "prayerHabit",
      patterns: [/pray.*weekly/i, /prayer.*weekly/i],
      valueExtractor: () => "weekly",
    },
    {
      field: "bibleReadingHabit",
      patterns: [/bible.*daily/i, /scripture.*daily/i],
      valueExtractor: () => "daily",
    },
    {
      field: "bibleReadingHabit",
      patterns: [/bible.*weekly/i, /scripture.*weekly/i],
      valueExtractor: () => "weekly",
    },
  ],
  finance: [
    {
      field: "monthlyIncome",
      patterns: [/income.*?(\d{3,6})/i],
      valueExtractor: (m) => parseInt(m[1]),
    },
    {
      field: "monthlySavings",
      patterns: [/savings.*?(\d{2,6})/i],
      valueExtractor: (m) => parseInt(m[1]),
    },
    {
      field: "debtAmount",
      patterns: [/debt.*?(\d{2,7})/i],
      valueExtractor: (m) => parseInt(m[1]),
    },
  ],
  goals: [
    {
      field: "topGoal",
      patterns: [/goal.*(?:is|to)\s+(.+)/i],
      valueExtractor: (m) => m[1]?.trim(),
    },
  ],
  health: [
    {
      field: "hoursOfSleep",
      patterns: [/sleep.*?(\d+)\s*(hours|hrs)/i],
      valueExtractor: (m) => parseInt(m[1]),
    },
    {
      field: "stressLevel",
      patterns: [/stress|anxious|overwhelmed/i],
      valueExtractor: () => "high",
    },
  ],
};

export function parseProfileUpdate(text: string): ProfileUpdate | null {
  const lower = text.toLowerCase();

  for (const [module, fields] of Object.entries(MODULE_PARSERS)) {
    for (const { field, patterns, valueExtractor } of fields) {
      for (const pattern of patterns) {
        const match = lower.match(pattern);
        if (match) {
          return {
            module,
            field,
            value: valueExtractor(match, text),
          };
        }
      }
    }
  }

  return null;
}

export function inferModule(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("goal")) return "goals";
  if (
    lower.includes("weight") ||
    lower.includes("exercise") ||
    lower.includes("height")
  )
    return "fitness";
  if (lower.includes("prayer") || lower.includes("bible")) return "faith";
  if (
    lower.includes("income") ||
    lower.includes("savings") ||
    lower.includes("debt")
  )
    return "finance";
  if (lower.includes("sleep") || lower.includes("stress")) return "health";
  return "general";
}
