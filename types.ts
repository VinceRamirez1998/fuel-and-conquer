export interface FamilyMember {
  id: string;
  name: string;
  sex: 'male' | 'female' | '';
  age: number | '';
  weight: number | '';
  weight_unit: 'lbs' | 'kg';
  target_weight: number | '';
  height_ft: number | '';
  height_in: number | '';
  height_cm: number | '';
  height_unit: 'ft' | 'cm';
  goal: 'Lose weight' | 'Build strength / muscle' | 'Both (lose fat and gain/maintain muscle)' | 'Maintain weight' | '';
  carb_preference: 'Very Low (0–30 g/day)' | 'Low (30–70 g/day)' | 'Moderate (70–100 g/day)' | 'High Carb (Recommended for Athletes)' | 'Not Sure — Recommend for Me' | 'No Restriction / Whole-Foods Approach' | '';
  fasting_preference: '16:8' | '18:6' | '20:4' | 'OMAD (One Meal A Day)' | 'No fasting' | 'I’m not sure — choose for me' | '';
  meals_per_day: number | '';
  food_quality_preference: 'High Quality' | 'Above Average' | 'Average / Most Cost-Effective' | '';
  selected_foods: Record<string, string[]>;
  meal_variety: 'simple_repeat' | 'varied_meals' | '';
  flavor_profile: 'Clean & Simple' | 'Savory & Balanced' | 'Bold & Spicy' | '';
  allow_snacks: boolean;
  food_preferences: string;
  sync_with_primary: boolean;
}

export type UserData = Omit<FamilyMember, 'id' | 'name'>;

export interface FormData {
  primary_user: UserData;
  include_family: boolean;
  family_members: FamilyMember[];
}

export interface DailyTargets {
  calories: number;
  protein_goal: number;
  carb_limit: number;
  explanation: string;
}

export interface ProgressMilestone {
  date: string;
  estimated_weight: string; // Use string to accommodate "lbs" or "kg"
  progress_note: string;
}

export interface GoalTimeline {
  estimated_goal_date: string;
  progress_timeline: ProgressMilestone[];
}

export interface MealSummary {
  name: string;
  protein: number;
  carbs: number;
  calories: number;
}

export interface MealStructure {
  fasting_window: string;
  schedule_description: string;
  meals: MealSummary[];
}

export interface Meal {
  name: string;
  description: string; // Per-person breakdown
  combined_recipe: string; // Aggregated total for meal prep
  protein: number;
  carbs: number;
}

export interface DailyPlan {
  day: string;
  meals: Meal[];
}

// FIX: Changed GroceryList to be an array of objects for better type safety and schema compatibility.
// UPDATE: Added quantity to each grocery list item.
export type GroceryList = {
  category: string;
  items: {
    item: string;
    quantity: string;
  }[];
}[];


export interface FamilySummary {
  name:string;
  goal: string;
  calories: number;
  protein: number;
  carb_limit: number;
  fasting: string;
}

export interface MealPlanResponse {
  disclaimer: string;
  daily_targets: DailyTargets;
  goal_timeline: GoalTimeline;
  meal_structure: MealStructure;
  seven_day_plan: DailyPlan[];
  grocery_list: GroceryList;
  family_summary: FamilySummary[] | null;
}