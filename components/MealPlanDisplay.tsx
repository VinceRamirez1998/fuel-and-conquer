import React from 'react';
import type { MealPlanResponse } from '../types';

interface MealPlanDisplayProps {
    plan: MealPlanResponse;
    onReset: () => void;
}

const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ plan, onReset }) => {
    const handleExportHtml = () => {
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fuel & Conquer Meal Plan</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            .no-print { display: none; }
            body { background: white; }
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 p-8">
    <div class="max-w-5xl mx-auto space-y-8 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <header class="flex items-center justify-between border-b pb-6">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-black border-2 border-lime-400 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=100&h=100" alt="F&C Logo" class="w-full h-full object-cover opacity-80" />
                </div>
                <div>
                    <h1 class="text-2xl font-black italic uppercase tracking-tighter leading-none">Fuel & <span class="text-lime-500">Conquer</span></h1>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Meal Architect Plan</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">${new Date().toLocaleDateString()}</p>
            </div>
        </header>

        <div class="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg text-sm">
            <h3 class="font-bold mb-1">Important Disclaimer</h3>
            <p>${plan.disclaimer}</p>
        </div>

        <section>
            <h2 class="text-xl font-bold text-slate-800 border-b pb-2 mb-4">Daily Blueprint</h2>
            <div class="grid grid-cols-3 gap-4 text-center">
                <div class="p-4 bg-teal-50 rounded-lg">
                    <p class="text-xs font-semibold text-teal-700 uppercase">Calories</p>
                    <p class="text-2xl font-bold text-teal-900">${plan.daily_targets.calories.toLocaleString()}</p>
                </div>
                <div class="p-4 bg-sky-50 rounded-lg">
                    <p class="text-xs font-semibold text-sky-700 uppercase">Protein</p>
                    <p class="text-2xl font-bold text-sky-900">${plan.daily_targets.protein_goal}g</p>
                </div>
                <div class="p-4 bg-amber-50 rounded-lg">
                    <p class="text-xs font-semibold text-amber-700 uppercase">Carb Limit</p>
                    <p class="text-2xl font-bold text-amber-900">&lt; ${plan.daily_targets.carb_limit}g</p>
                </div>
            </div>
            <div class="mt-4 p-4 bg-slate-50 rounded-lg italic text-sm text-slate-600">
                ${plan.daily_targets.explanation}
            </div>
        </section>

        ${plan.goal_timeline ? `
        <section>
            <h2 class="text-xl font-bold text-slate-800 border-b pb-2 mb-4">Goal Timeline</h2>
            <p class="font-semibold text-slate-700">Estimated Goal Date: <span class="text-teal-600">${plan.goal_timeline.estimated_goal_date}</span></p>
            <div class="mt-4 overflow-x-auto">
                <table class="w-full text-left text-sm border-collapse">
                    <thead class="bg-slate-100 text-slate-600">
                        <tr>
                            <th class="p-2 border font-semibold">Date</th>
                            <th class="p-2 border font-semibold">Est. Weight</th>
                            <th class="p-2 border font-semibold">Progress Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${plan.goal_timeline.progress_timeline.map(m => `
                            <tr>
                                <td class="p-2 border text-slate-800 font-medium">${m.date}</td>
                                <td class="p-2 border text-slate-600">${m.estimated_weight}</td>
                                <td class="p-2 border text-slate-600">${m.progress_note}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>` : ''}

        <section>
            <h2 class="text-xl font-bold text-slate-800 border-b pb-2 mb-4">Meal Structure</h2>
            <p class="text-sm mb-4"><strong class="text-slate-700">Fasting Window:</strong> ${plan.meal_structure.fasting_window}</p>
            <div class="space-y-2">
                ${plan.meal_structure.meals.map(m => `
                    <div class="flex justify-between border-b border-slate-100 py-1 text-sm">
                        <span class="font-bold">${m.name}</span>
                        <span>${m.protein}g P | ${m.carbs}g C | ${m.calories} kcal</span>
                    </div>
                `).join('')}
            </div>
        </section>

        <section>
            <h2 class="text-xl font-bold text-slate-800 border-b pb-2 mb-4">7-Day Plan</h2>
            <div class="space-y-6">
                ${plan.seven_day_plan.map(day => `
                    <div class="border-t pt-4">
                        <h3 class="font-bold text-slate-700 mb-2 uppercase tracking-wide">${day.day}</h3>
                        <div class="grid gap-4">
                            ${day.meals.map(meal => `
                                <div class="p-3 bg-slate-50 rounded border border-slate-100">
                                    <p class="font-bold text-slate-800 text-sm">${meal.name}</p>
                                    <p class="text-xs text-slate-600 my-1">${meal.description}</p>
                                    <p class="text-[10px] text-slate-400 font-bold uppercase mt-2">Prep Total: ${meal.combined_recipe}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <section>
            <h2 class="text-xl font-bold text-slate-800 border-b pb-2 mb-4">Grocery List</h2>
            <div class="grid grid-cols-2 gap-8">
                ${plan.grocery_list.map(cat => `
                    <div>
                        <h3 class="font-bold text-teal-700 text-sm mb-2 uppercase">${cat.category}</h3>
                        <ul class="text-xs space-y-1">
                            ${cat.items.map(i => `
                                <li class="flex justify-between border-b border-slate-50 py-1">
                                    <span>${i.item}</span>
                                    <span class="font-bold text-slate-800">${i.quantity}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </section>

        ${plan.family_summary && plan.family_summary.length > 0 ? `
        <section>
            <h2 class="text-xl font-bold text-slate-800 border-b pb-2 mb-4">Family Summary</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                    <thead class="bg-slate-100">
                        <tr>
                            <th class="p-2 border">Name</th>
                            <th class="p-2 border">Goal</th>
                            <th class="p-2 border">Cals</th>
                            <th class="p-2 border">Protein</th>
                            <th class="p-2 border">Carbs</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${plan.family_summary.map(f => `
                            <tr>
                                <td class="p-2 border font-bold">${f.name}</td>
                                <td class="p-2 border">${f.goal}</td>
                                <td class="p-2 border">${f.calories}</td>
                                <td class="p-2 border">${f.protein}g</td>
                                <td class="p-2 border">&lt; ${f.carb_limit}g</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>` : ''}

        <footer class="mt-8 pt-8 border-t text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Fuel & Conquer Meal Architect | Generated by AI
        </footer>
    </div>
    <div class="fixed bottom-8 right-8 no-print">
        <button onclick="window.print()" class="bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform">Print to PDF</button>
    </div>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Fuel_and_Conquer_Meal_Plan.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Disclaimer */}
            <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg">
                <h3 className="font-bold">Important Disclaimer</h3>
                <p className="text-sm">{plan.disclaimer}</p>
            </div>

            {/* Header Actions */}
            <div className="flex justify-end gap-3 no-print">
                 <button 
                    onClick={handleExportHtml}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="Vertical 4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export as HTML
                </button>
            </div>

            {/* Main Plan & Grocery List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Daily Targets */}
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-4">Your Daily Blueprint</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-teal-50 rounded-lg">
                                <p className="text-sm font-semibold text-teal-700">Daily Calories</p>
                                <p className="text-3xl font-bold text-teal-900">{plan.daily_targets.calories.toLocaleString()}</p>
                                <p className="text-sm text-teal-800">kcal</p>
                            </div>
                            <div className="p-4 bg-sky-50 rounded-lg">
                                <p className="text-sm font-semibold text-sky-700">Protein Goal</p>
                                <p className="text-3xl font-bold text-sky-900">{plan.daily_targets.protein_goal}</p>
                                <p className="text-sm text-sky-800">grams/day</p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-lg">
                                <p className="text-sm font-semibold text-amber-700">Carb Limit</p>
                                <p className="text-3xl font-bold text-amber-900">&lt; {plan.daily_targets.carb_limit}</p>
                                <p className="text-sm text-amber-800">grams/day</p>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-slate-100 rounded-md">
                            <p className="text-slate-700 font-semibold mb-2">The "Two Numbers That Matter™" Philosophy:</p>
                            <p className="text-slate-600 text-sm">{plan.daily_targets.explanation} We only track Protein and Carbs. Hit your protein goal, stay under your carb limit, and let your body handle the rest.</p>
                        </div>
                    </div>

                    {/* Goal Timeline */}
                    {plan.goal_timeline && (
                         <div className="p-6 bg-white rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-4">Your Estimated Timeline</h2>
                            <div>
                                <p className="font-semibold text-slate-700">Estimated Goal Date: <span className="font-bold text-teal-600">{plan.goal_timeline.estimated_goal_date}</span></p>
                                <p className="text-xs text-slate-500 mt-1 italic">These are projected dates and weights based on your plan’s pace and consistent adherence. Actual results may vary.</p>
                            </div>
                            <details className="mt-4 group">
                                <summary className="font-semibold text-slate-700 cursor-pointer list-none flex items-center">
                                    <span className="transition-transform duration-200 group-open:rotate-90">▸</span>
                                    <span className="ml-2">View Progress Timeline</span>
                                </summary>
                                <div className="mt-4 pl-4 border-l-2 border-slate-200">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-50 text-slate-600">
                                                <tr>
                                                    <th className="p-2 font-semibold">Date</th>
                                                    <th className="p-2 font-semibold">Est. Weight</th>
                                                    <th className="p-2 font-semibold">Progress Note</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {plan.goal_timeline.progress_timeline.map(milestone => (
                                                    <tr key={milestone.date} className="border-b border-slate-100 last:border-0">
                                                        <td className="p-2 font-medium text-slate-800">{milestone.date}</td>
                                                        <td className="p-2 text-slate-600">{milestone.estimated_weight}</td>
                                                        <td className="p-2 text-slate-600">{milestone.progress_note}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-3 italic">All timelines and milestones are estimated projections based on your current plan and consistent adherence. Results may vary due to individual factors.</p>
                                </div>
                            </details>
                         </div>
                    )}
                    
                     {/* Meal Structure */}
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-4">Fasting & Meal Structure</h2>
                        <p><strong className="text-slate-700">Fasting Window:</strong> <span className="text-teal-600 font-semibold">{plan.meal_structure.fasting_window}</span></p>
                        <p className="mt-2 text-slate-600">{plan.meal_structure.schedule_description}</p>
                        <div className="mt-4 space-y-2 divide-y divide-slate-100">
                            {plan.meal_structure.meals.map((meal, index) => (
                                <div key={index} className="flex justify-between items-baseline pt-2 first:pt-0">
                                    <span className="font-semibold text-slate-800">{meal.name}</span>
                                    <span className="text-sm text-slate-600 text-right">
                                        {Math.round(meal.protein)}g Protein, {Math.round(meal.carbs)}g Carbs &ndash; ~{Math.round(meal.calories).toLocaleString()} calories
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 7-Day Plan */}
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-4">Your 7-Day Meal Plan</h2>
                        <div className="space-y-6">
                            {plan.seven_day_plan.map(day => (
                                <div key={day.day} className="border-t pt-4">
                                    <h3 className="font-bold text-lg text-slate-700">{day.day}</h3>
                                    <div className="mt-2 space-y-4 pl-4">
                                        {day.meals.map(meal => (
                                            <div key={meal.name} className="p-3 bg-slate-50 rounded-md">
                                                <p className="font-semibold text-slate-800">{meal.name}</p>
                                                <p className="text-sm text-slate-600 mt-1">{meal.description}</p>
                                                <p className="text-sm text-slate-800 mt-2"><strong className="font-semibold">Total for Meal Prep:</strong> {meal.combined_recipe}</p>
                                                <p className="text-xs text-slate-500 mt-2">~{meal.protein}g Protein | ~{meal.carbs}g Carbs per serving</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grocery List */}
                <div className="lg:col-span-1 space-y-8">
                     <div className="p-6 bg-white rounded-lg shadow-lg sticky top-8">
                         <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-4">Weekly Grocery List</h2>
                         <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                            {plan.grocery_list.map((groceryCategory) => (
                                <div key={groceryCategory.category}>
                                    <h3 className="font-semibold text-teal-700 text-lg">{groceryCategory.category}</h3>
                                    <ul className="mt-2 space-y-1 text-slate-600 text-sm">
                                        {groceryCategory.items.map((item, index) => (
                                            <li key={index} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-b-0">
                                                <span>{item.item}</span>
                                                <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-xs">{item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            </div>

            {/* Family Summary */}
            {plan.family_summary && plan.family_summary.length > 0 && (
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-4">Family Summary</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-100 text-sm text-slate-600">
                                <tr>
                                    <th className="p-3 font-semibold">Name</th>
                                    <th className="p-3 font-semibold">Goal</th>
                                    <th className="p-3 font-semibold">Calories</th>
                                    <th className="p-3 font-semibold">Protein (g)</th>
                                    <th className="p-3 font-semibold">Carb Limit (g)</th>
                                    <th className="p-3 font-semibold">Fasting</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plan.family_summary.map(member => (
                                    <tr key={member.name} className="border-b">
                                        <td className="p-3 font-medium text-slate-800">{member.name}</td>
                                        <td className="p-3 text-slate-600">{member.goal}</td>
                                        <td className="p-3 text-slate-600">{member.calories.toLocaleString()}</td>
                                        <td className="p-3 text-slate-600">{member.protein}</td>
                                        <td className="p-3 text-slate-600">&lt; {member.carb_limit}</td>
                                        <td className="p-3 text-slate-600">{member.fasting}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            <div className="text-center pt-8">
                 <button 
                    onClick={onReset}
                    className="px-8 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                    Create a New Plan
                </button>
            </div>
        </div>
    );
};

export default MealPlanDisplay;