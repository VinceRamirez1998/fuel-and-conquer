
import type { FormData, UserData } from './types';

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

export const PROTEIN_OPTIONS = [
  'Beef',
  'Pork',
  'Chicken',
  'Seafood'
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
  selected_proteins: [],
  food_preferences: '',
};

export const INITIAL_FORM_STATE: FormData = {
  user: INITIAL_USER_STATE,
  language: 'en',
};

// --- TRANSLATIONS ---

export const TRANSLATIONS = {
    en: {
        headers: {
            appSubtitle: "Meal Plan Architect - Essentials",
            heroTitle: "Built Around You",
            heroSubtitle: "Enter your stats, select your proteins, and unlock a personalized 3-day nutrition plan.",
            loadingTitle: "Engineering Your Plan...",
            loadingSubtitle: "Building your personalized nutrition plan.",
            errorTitle: "System Alert",
            resetBtn: "Reset & Try Again",
            yourInfo: "Your Statistics",
            generateBtn: "Generate 3-Day Plan",
            exportHtml: "Export as HTML (Email Ready)",
            copyButtonInstruction: "This button copies your plan to your clipboard.\nPaste it into your email and send it to yourself so you always have it handy.",
            createOldPlan: "Create a New Plan",
            disclaimer: "Important Disclaimer",
            dailyBlueprint: "Your Daily Blueprint",
            dailyCalories: "Daily Calories",
            proteinGoal: "Protein Goal",
            carbLimit: "Carb Limit",
            twoNumbersPhilosophy: "The \"Two Numbers That Matter™\" Philosophy:",
            estimatedTimeline: "Estimated Goal Date",
            estimatedGoalDate: "You could reach your goal by:",
            threeDayPlan: "Your 3-Day Meal Plan",
            footer: "Rewire your habits. Conquer your goals.",
            generatedOn: "Generated on",
            systemAlert: "System Alert",
            deselectAll: "Deselect all",
            selectAll: "Select all",
        },
        labels: {
            name: "Name",
            sex: "Gender",
            age: "Age",
            currentWeight: "Current Weight",
            targetWeight: "Target Weight",
            height: "Height",
            primaryGoal: "Primary Goal",
            carbPref: "Carb Preference",
            proteinSelect: "Select Your Preferred Proteins",
            proteinDesc: "We will build your meals around these choices, adding necessary healthy fats and vegetables automatically.",
            foodPrefs: "Allergies or Dislikes (Optional)",
            foodPrefsPlaceholder: "e.g., allergic to shellfish, hate cilantro.",
            select: "Select...",
            selectGoal: "Select a goal...",
            selectCarb: "Select carb level...",
        },
        options: {
            sex: { male: "Male", female: "Female" },
            goals: {
                'Lose weight': "Lose weight",
                'Maintain weight': "Maintain weight",
                'Build strength / muscle': "Build strength / muscle",
                'Both (lose fat and gain/maintain muscle)': "Both (lose fat and gain/maintain muscle)"
            },
            carbs: {
                'Very Low (0–30 g/day)': "Very Low (0–30 g/day) - Carnivore/Strict",
                'Low (30–70 g/day)': "Low (30–70 g/day) - Keto/Flexible",
                'Moderate (70–100 g/day)': "Moderate (70–100 g/day) - Balanced/Active",
                'High Carb (Recommended for Athletes)': "High Carb (Recommended for Athletes)",
                'Not Sure — Recommend for Me': "Not Sure — Recommend for Me",
                'No Restriction / Whole-Foods Approach': "No Restriction / Whole-Foods Approach"
            },
            proteins: {
                'Beef': 'Beef',
                'Pork': 'Pork',
                'Chicken': 'Chicken',
                'Seafood': 'Seafood'
            }
        }
    },
    es: {
        headers: {
            appSubtitle: "Arquitecto Nutricional · Esencial",
            heroTitle: "Diseñado para ti",
            heroSubtitle: "Ingresa tus datos, elige tus proteínas y desbloquea un plan nutricional personalizado de 3 días.",
            loadingTitle: "Diseñando Tu Plan...",
            loadingSubtitle: "Calibrando macros para el máximo rendimiento.",
            errorTitle: "Alerta del Sistema",
            resetBtn: "Reiniciar e Intentar de Nuevo",
            yourInfo: "Tus Estadísticas",
            generateBtn: "Generar Plan de 3 Días",
            exportHtml: "Exportar como HTML (Listo para Email)",
            copyButtonInstruction: "Este botón copia tu plan al portapapeles.\nPégalo en tu email y envíatelo para tenerlo siempre a mano.",
            createOldPlan: "Crear Nuevo Plan",
            disclaimer: "Aviso Importante",
            dailyBlueprint: "Tu Plan Diario",
            dailyCalories: "Calorías Diarias",
            proteinGoal: "Meta de Proteína",
            carbLimit: "Límite de Carbs",
            twoNumbersPhilosophy: "La Filosofía de \"Dos Números que Importan™\":",
            estimatedTimeline: "Fecha Estimada de Meta",
            estimatedGoalDate: "Podrías alcanzar tu meta para el:",
            threeDayPlan: "Tu Plan de 3 Días",
            footer: "Reconfigura tus hábitos. Conquista tus metas.",
            generatedOn: "Generado el",
            systemAlert: "Alerta del Sistema",
            deselectAll: "Deseleccionar todo",
            selectAll: "Seleccionar todo",
        },
        labels: {
            name: "Nombre",
            sex: "Género",
            age: "Edad",
            currentWeight: "Peso Actual",
            targetWeight: "Peso Meta",
            height: "Altura",
            primaryGoal: "Meta Principal",
            carbPref: "Preferencia de Carbohidratos",
            proteinSelect: "Selecciona tus Proteínas Preferidas",
            proteinDesc: "Construiremos tus comidas en base a estas elecciones, agregando grasas saludables y vegetales automáticamente.",
            foodPrefs: "Alergias o Aversiones (Opcional)",
            foodPrefsPlaceholder: "ej. alérgico a mariscos, odio el cilantro.",
            select: "Seleccionar...",
            selectGoal: "Selecciona una meta...",
            selectCarb: "Selecciona nivel de carbs...",
        },
        options: {
            sex: { male: "Masculino", female: "Femenino" },
            goals: {
                'Lose weight': "Perder peso",
                'Maintain weight': "Mantener peso",
                'Build strength / muscle': "Ganar fuerza / músculo",
                'Both (lose fat and gain/maintain muscle)': "Ambos (recomposición corporal)"
            },
            carbs: {
                'Very Low (0–30 g/day)': "Muy Bajo (0–30 g/día) - Carnívoro/Estricto",
                'Low (30–70 g/day)': "Bajo (30–70 g/día) - Keto Flexible",
                'Moderate (70–100 g/day)': "Moderado (70–100 g/día) - Balanceado/Activo",
                'High Carb (Recommended for Athletes)': "Alto en Carbs (Recomendado para Atletas)",
                'Not Sure — Recommend for Me': "No estoy seguro — Recomiéndame",
                'No Restriction / Whole-Foods Approach': "Sin Restricción / Enfoque Comida Real"
            },
            proteins: {
                'Beef': 'Carne de Res',
                'Pork': 'Cerdo',
                'Chicken': 'Pollo',
                'Seafood': 'Pescados y Mariscos'
            }
        }
    }
};
