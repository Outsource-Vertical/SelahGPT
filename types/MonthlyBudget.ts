export interface BudgetCategory {
  [subcategory: string]: number;
}

export interface MonthlyBudget {
  month: string; // e.g. "2025-06"
  Children?: BudgetCategory;
  Debt?: BudgetCategory;
  Education?: BudgetCategory;
  Entertainment?: BudgetCategory;
  Everyday?: BudgetCategory;
  Gifts?: BudgetCategory;
  HealthMedical?: BudgetCategory;
  Home?: BudgetCategory;
  Insurance?: BudgetCategory;
  Pets?: BudgetCategory;
  Technology?: BudgetCategory;
  Transportation?: BudgetCategory;
  Travel?: BudgetCategory;
  Utilities?: BudgetCategory;
  Other?: BudgetCategory;
  updatedAt: any;
}
