import type { FormData, UserData, FamilyMember } from './types';

export const GOAL_OPTIONS: UserData['goal'][] = [
  'Lose weight',
  'Maintain weight',
  'Build strength / muscle',
  'Both (lose fat and gain/maintain muscle)',
];

export const CARB_PREFERENCE_OPTIONS: UserData['carb_preference'][] = [
  'Very Low (0–30 g/day)',
  'Low (30–70 g/day)',
  'Moderate (70–100 g/day)',
  'High Carb (Recommended for Athletes)',
  'Not Sure — Recommend for Me',
  'No Restriction / Whole-Foods Approach',
];

export const FASTING_PREFERENCE_OPTIONS: UserData['fasting_preference'][] = [
  '18:6',
  '16:8',
  '20:4',
  'OMAD (One Meal A Day)',
  'No fasting',
  'I’m not sure — choose for me',
];

export const MEALS_PER_DAY_OPTIONS = [2, 3, 4];

export const FOOD_QUALITY_PREFERENCE_OPTIONS: UserData['food_quality_preference'][] = [
  'High Quality',
  'Above Average',
  'Average / Most Cost-Effective',
];

export const FOOD_CATEGORIES: Record<string, string[]> = {
  '🥩 Animal Proteins': [
    'Ribeye',
    'New York strip',
    'Sirloin',
    'Filet mignon',
    'Flank steak',
    'Skirt steak',
    'Ground beef',
    'Brisket',
    'Chuck roast',
    'Chicken',
    'Pork',
    'Turkey',
    'Lamb',
    'Eggs',
  ],
  '🐟 Seafood': [
    'Salmon',
    'Shrimp',
    'Tuna',
    'Cod or white fish',
    'Sardines',
    'Other shellfish (crab, scallops, etc.)',
  ],
  '🧈 Fats & Oils': [
    'Olive oil',
    'Avocado oil',
    'Coconut oil',
    'Butter or ghee',
    'Tallow or lard',
  ],
  '🌶️ Condiments & Seasonings (Healthy, Low-Inflammatory Options)': [
    'Sea salt or pink salt',
    'Black pepper',
    'Garlic powder',
    'Onion powder',
    'Smoked paprika',
    'Chili flakes or cayenne',
    'Mustard (no added sugar)',
    'Mayonnaise (avocado-oil or olive-oil based)',
    'Hot sauce (no sugar or seed oils)',
    'Vinegar (apple cider, white, or balsamic)',
    'Lemon or lime juice',
    'Fresh herbs (cilantro, parsley, basil, rosemary, thyme)',
  ],
  '🥦 Vegetables (low-carb, non-starchy only)': [
    'Leafy greens (spinach, kale, lettuce)',
    'Broccoli, cauliflower',
    'Zucchini, cucumber',
    'Asparagus, green beans',
    'Bell peppers, mushrooms',
    'Cabbage, Brussels sprouts',
  ],
  '🥔 Tubers & Starchy Veggies (high-carb)': [
    'Potatoes (Russet, Yukon Gold, Red)',
    'Sweet Potatoes / Yams',
    'Carrots',
    'Beets',
    'Squash (Butternut, Acorn)',
    'Parsnips',
  ],
  '🍓 Fruits (low sugar only)': [
    'Berries (strawberries, blueberries, raspberries)',
    'Avocado',
    'Small portions of citrus (lemon, lime)',
  ],
  '🥜 Optional Add-ons': [
    'Nuts and seeds (almonds, walnuts, chia, flax)',
    'Full-fat Greek yogurt',
    'Cheese (if tolerated)',
    'Milk',
    'Protein powders (whey, isolate, or egg white)',
  ],
};

export const MEAL_VARIETY_OPTIONS: {id: 'simple_repeat' | 'varied_meals', label: string, description: string}[] = [
    { id: 'simple_repeat', label: 'Keep It Simple', description: 'I prefer to repeat the same meals often to make prep and shopping easier.' },
    { id: 'varied_meals', label: 'Add More Variety', description: 'I like having different meals and flavors, even if prep takes a bit longer.' },
];

export const FLAVOR_PROFILE_OPTIONS: UserData['flavor_profile'][] = [
  'Clean & Simple',
  'Savory & Balanced',
  'Bold & Spicy',
];


export const INITIAL_USER_STATE: UserData = {
  sex: '',
  age: '',
  weight: '',
  weight_unit: 'lbs',
  target_weight: '',
  height_ft: '',
  height_in: '',
  height_cm: '',
  height_unit: 'ft',
  goal: '',
  carb_preference: '',
  fasting_preference: '',
  meals_per_day: '',
  food_quality_preference: '',
  selected_foods: {},
  meal_variety: '',
  flavor_profile: '',
  allow_snacks: false,
  food_preferences: '',
  sync_with_primary: false,
};

export const INITIAL_FORM_STATE: FormData = {
  primary_user: INITIAL_USER_STATE,
  include_family: false,
  family_members: [],
};