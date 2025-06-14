export interface FinanceProfile {
  financialGoals: string[];
  incomeType: "salary" | "self-employed" | "both";
  budgetStyle: "zero-based" | "percentage-based" | "flexible" | "none";
  usesBudgetApp?: boolean;
  givingStyle?: "tithing" | "spontaneous" | "percentage-based" | "none";
  moneyMindset?:
    | "scarcity"
    | "abundance"
    | "biblical stewardship"
    | "prosperity gospel";
  financialStressors?: string[];
  spiritualViewOnMoney?: string;
  wantsScriptureFinancialAdvice: boolean;
  updatedAt: any;
}
