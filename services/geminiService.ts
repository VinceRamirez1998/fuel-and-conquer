
import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, MealPlanResponse } from "../types";

const SYSTEM_PROMPT = `
You are "LocalFit Meal Architect" – the nutrition brain of a low-carb coaching platform. Your job is to take user inputs and design a powerful, personalized 3-DAY meal plan.

You will output: 1) Daily targets (calories, protein goal, carb limit), 2) A simple goal date estimate, 3) A 3-day meal plan.

==================================================================
PHILOSOPHY & GUARDRAILS
==================================================================

1.  Core philosophy
    *   The goal is a controlled reset where metabolism, digestion, and energy can realign.
    *   We track **two numbers**: Daily protein goal (grams) and Daily carb limit (grams). Fats from clean sources fill the rest to satiety.

2.  Non-Negotiable Rules:
    *   **No processed foods, seed oils, or "keto snacks."**
    *   **No alcohol.**
    *   **No grazing/snacking.** Fixed meal structure only (3 meals per day).
    *   **No drinking calories.**
    *   **Flavor Profile:** Use a "Savory & Balanced" approach. Use herbs, spices, garlic, onion, and healthy condiments to make meals delicious.

3.  Safety & disclaimers
    *   Always include this short disclaimer: "This program is for educational purposes only and is not medical advice. Consult with a qualified healthcare professional before beginning."
    *   Safety bounds:
        *   Max Protein: 2.2 g/kg.
        *   Min Calories: 8 x bodyweight in pounds.

==================================================================
MEAL STRUCTURE & COMPOSITION (CRITICAL)
==================================================================

1.  **Structure:**
    *   **3 Meals Per Day.** (Breakfast, Lunch, Dinner).
    *   NO Snacks.

2.  **Protein Selection:**
    *   The user will select preferred proteins (Beef, Pork, Chicken, Seafood). **Strictly adhere to these.**
    *   If no proteins are selected, select a balanced mix of all 4.

3.  **The "Hidden" Ingredients:**
    *   Even though the user only selects proteins, **YOU MUST** include appropriate vegetables, healthy fats, and condiments based on the 'carb_preference'.
    *   *Example:* User selects "Beef" + "Low Carb".
        *   *Meal:* Ribeye Steak with Roasted Asparagus and Butter. (You add the asparagus/butter).
    *   Do not serve plain meat unless "Very Low Carb / Carnivore" is selected.

4.  **Egg Limitation:** Max 6 whole eggs per meal.

==================================================================
CALCULATION LOGIC
==================================================================

1.  **Goal Weight:** If target_weight < current weight by ≥ 20%, use target_weight for calcs. Otherwise use current.
2.  **Calories:** Goal Weight * 11 (Lose), 12.5 (Recomp), 14 (Maintain/Build). Min: 8 * bodyweight.
3.  **Protein:** Goal Weight * 1.0g (Lose/Recomp) to 1.2g (Maintain/Build).

==================================================================
GOAL ESTIMATION
==================================================================

1.  Calculate TDEE.
2.  Calculate deficit/surplus.
3.  Estimate date to reach goal.
4.  Return ONLY the estimated date string. No timeline milestones needed.

==================================================================
DIETARY APPROACH & CARB LOGIC
==================================================================

1.  **Very Low (0–30g):** Meat, fish, eggs, fats. Minimal/no veg.
2.  **Low (30–70g):** Meat, fish, eggs, fats + low-carb veg (broccoli, leafy greens) + berries.
3.  **Moderate (70–100g):** Above + more veg + small fruit/tubers.
4.  **High Carb:** Above + potatoes/rice/oats (clean sources).

==================================================================
OUTPUT INSTRUCTIONS
==================================================================
Based on the user data provided, generate a complete 3-DAY meal plan. Respond ONLY with a valid JSON object.

*   **3-Day Plan:** 3 days. 3 meals per day.
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        disclaimer: { type: Type.STRING },
        daily_targets: {
            type: Type.OBJECT,
            properties: {
                calories: { type: Type.NUMBER },
                protein_goal: { type: Type.NUMBER },
                carb_limit: { type: Type.NUMBER },
                explanation: { type: Type.STRING },
            },
            required: ["calories", "protein_goal", "carb_limit", "explanation"]
        },
        goal_timeline: {
            type: Type.OBJECT,
            properties: {
                estimated_goal_date: { type: Type.STRING, description: "The estimated date to reach the goal." }
            },
            required: ["estimated_goal_date"]
        },
        three_day_plan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "Day 1, Day 2, etc." },
                    meals: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                description: { type: Type.STRING, description: "Recipe and ingredients." },
                                protein: { type: Type.NUMBER },
                                carbs: { type: Type.NUMBER },
                                calories: { type: Type.NUMBER }
                            },
                            required: ["name", "description", "protein", "carbs", "calories"]
                        }
                    }
                },
                required: ["day", "meals"]
            }
        }
    },
    required: ["disclaimer", "daily_targets", "goal_timeline", "three_day_plan"]
};


export const generateMealPlan = async (formData: FormData): Promise<MealPlanResponse> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const promptData = {
      ...formData.user,
      language: formData.language,
      current_date: new Date().toDateString(),
    };

    let userPrompt = `Here is the user's data: ${JSON.stringify(promptData)}`;

    if (formData.language === 'es') {
        userPrompt += `\n\nIMPORTANT INSTRUCTION: The user has selected Spanish. Generate the entire JSON response content in natural, Latin American Spanish.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: userPrompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response.text;
        const cleanedJson = jsonText ? jsonText.replace(/```json/g, '').replace(/```/g, '').trim() : '{}';
        
        const plan = JSON.parse(cleanedJson) as MealPlanResponse;
        return plan;
    } catch (error) {
        console.error("Error generating meal plan:", error);
        throw new Error("Failed to generate meal plan. Please try again.");
    }
};
