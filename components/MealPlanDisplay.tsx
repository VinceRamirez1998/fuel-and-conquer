
import React, { useState } from 'react';
import type { MealPlanResponse, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface MealPlanDisplayProps {
    plan: MealPlanResponse;
    onReset: () => void;
    language: Language;
}

const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ plan, onReset, language }) => {
    const t = TRANSLATIONS[language];
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyPlan = async () => {
        // Color Palette & Constants for Inline Styles (Optimized for Email Clients)
        const c = {
            bgBody: '#f1f5f9',
            textMain: '#1e293b',
            textLight: '#475569',
            textMuted: '#64748b',
            border: '#e2e8f0',
            tealDark: '#134e4a',
            tealBg: '#f0fdfa',
            tealText: '#0f766e',
            skyDark: '#0c4a6e',
            skyBg: '#f0f9ff',
            amberDark: '#78350f',
            amberBg: '#fffbeb',
            limeAccent: '#84cc16',
            yellowBg: '#fefce8',
            yellowBorder: '#eab308',
            yellowText: '#854d0e',
            black: '#000000',
        };

        const dateStr = new Date().toLocaleDateString(language === 'es' ? 'es-US' : 'en-US');

        // 1. Construct HTML Representation (Rich Text for Email Body)
        // Note: We strip the <html>/<body> tags for clipboard pasting to ensure it flows into the email body correctly.
        const htmlContent = `
<div style="font-family: Helvetica, Arial, sans-serif; color: ${c.textMain}; background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid ${c.border}; max-width: 600px;">
    
    <!-- HEADER -->
    <div style="border-bottom: 2px solid ${c.limeAccent}; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; font-style: italic; text-transform: uppercase; color: #0f172a;">
            Fuel & <span style="color: ${c.limeAccent};">Conquer</span>
        </h1>
        <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">
            ${t.headers.generatedOn} ${dateStr}
        </p>
    </div>

    <!-- DISCLAIMER -->
    <div style="background-color: ${c.yellowBg}; border-left: 4px solid ${c.yellowBorder}; padding: 12px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: ${c.yellowText}; font-weight: bold;">${t.headers.disclaimer}</p>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: ${c.yellowText};">${plan.disclaimer}</p>
    </div>

    <!-- DAILY BLUEPRINT -->
    <div style="margin-bottom: 32px;">
        <h2 style="font-size: 20px; font-weight: bold; color: ${c.textMain}; border-bottom: 1px solid ${c.border}; padding-bottom: 8px; margin-bottom: 16px;">${t.headers.dailyBlueprint}</h2>
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
            <tr>
                <td width="32%" valign="top" style="background-color: ${c.tealBg}; padding: 12px; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; color: ${c.tealText};">${t.headers.dailyCalories}</p>
                    <p style="margin: 4px 0; font-size: 24px; font-weight: bold; color: ${c.tealDark};">${plan.daily_targets.calories.toLocaleString()}</p>
                    <p style="margin: 0; font-size: 11px; color: ${c.tealDark};">kcal</p>
                </td>
                <td width="2%"></td>
                <td width="32%" valign="top" style="background-color: ${c.skyBg}; padding: 12px; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; color: #0369a1;">${t.headers.proteinGoal}</p>
                    <p style="margin: 4px 0; font-size: 24px; font-weight: bold; color: ${c.skyDark};">${plan.daily_targets.protein_goal}</p>
                    <p style="margin: 0; font-size: 11px; color: ${c.skyDark};">grams</p>
                </td>
                <td width="2%"></td>
                <td width="32%" valign="top" style="background-color: ${c.amberBg}; padding: 12px; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; color: #b45309;">${t.headers.carbLimit}</p>
                    <p style="margin: 4px 0; font-size: 24px; font-weight: bold; color: ${c.amberDark};">&lt; ${plan.daily_targets.carb_limit}</p>
                    <p style="margin: 0; font-size: 11px; color: ${c.amberDark};">grams</p>
                </td>
            </tr>
        </table>

        <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; font-size: 14px; color: ${c.textLight}; line-height: 1.5;">
            <strong style="color: ${c.textMain};">${t.headers.twoNumbersPhilosophy}</strong> ${plan.daily_targets.explanation}
        </div>

        <div style="margin-top: 16px; text-align: center;">
             <p style="font-size: 16px; margin: 0; color: ${c.textMain};">
                <strong style="color: ${c.textLight};">${t.headers.estimatedGoalDate}</strong> <span style="color: ${c.tealText}; font-weight: bold;">${plan.goal_timeline.estimated_goal_date}</span>
            </p>
        </div>
    </div>

    <!-- MEAL PLAN -->
    <div>
        <h2 style="font-size: 20px; font-weight: bold; color: ${c.textMain}; border-bottom: 1px solid ${c.border}; padding-bottom: 8px; margin-bottom: 20px;">${t.headers.threeDayPlan}</h2>
        
        ${plan.three_day_plan.map((day, i) => `
            <div style="${i !== 0 ? `border-top: 1px solid ${c.border}; padding-top: 20px; margin-top: 20px;` : ''}">
                <h3 style="font-size: 16px; font-weight: bold; color: ${c.textMain}; margin: 0 0 12px 0;">${day.day}</h3>
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${day.meals.map(meal => `
                        <tr>
                            <td style="padding-bottom: 12px;">
                                <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px;">
                                    <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: ${c.textMain};">${meal.name}</p>
                                    <p style="margin: 0 0 8px 0; font-size: 13px; color: ${c.textLight}; line-height: 1.4;">${meal.description}</p>
                                    <p style="margin: 0; font-size: 11px; color: ${c.textMuted};">~${meal.protein}g P | ~${meal.carbs}g C | ~${meal.calories} kcal</p>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `).join('')}
    </div>
</div>
`;

        // 2. Construct Plain Text Representation (Fallback)
        const textContent = `
FUEL & CONQUER MEAL PLAN
Generated on: ${dateStr}

DAILY TARGETS
-------------
Calories: ${plan.daily_targets.calories}
Protein: ${plan.daily_targets.protein_goal}g
Carb Limit: < ${plan.daily_targets.carb_limit}g

GOAL ESTIMATE
-------------
Estimated Date: ${plan.goal_timeline.estimated_goal_date}

${plan.three_day_plan.map(day => `
${day.day.toUpperCase()}
${day.meals.map(meal => `
* ${meal.name}
  ${meal.description}
  (Protein: ${meal.protein}g | Carbs: ${meal.carbs}g | Calories: ${meal.calories})
`).join('')}
`).join('\n')}

DISCLAIMER
----------
${plan.disclaimer}
`.trim();

        // 3. Execute Clipboard Write
        try {
            const blobHtml = new Blob([htmlContent], { type: 'text/html' });
            const blobText = new Blob([textContent], { type: 'text/plain' });
            
            const data = [new ClipboardItem({ 
                ['text/html']: blobHtml,
                ['text/plain']: blobText
            })];
            
            await navigator.clipboard.write(data);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        } catch (err) {
            console.error('Failed to copy to clipboard', err);
            // Fallback for some browsers or insecure contexts if needed, though rare in modern apps
            alert("Unable to copy to clipboard automatically. Please try selecting the text manually.");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative max-w-4xl mx-auto">
            {/* Disclaimer */}
            <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg">
                <h3 className="font-bold">{t.headers.disclaimer}</h3>
                <p className="text-sm">{plan.disclaimer}</p>
            </div>

            {/* Header Actions */}
            <div className="flex flex-col items-end gap-2 no-print">
                 <button 
                    onClick={handleCopyPlan}
                    disabled={isCopied}
                    className={`flex items-center gap-2 px-4 py-2 border font-bold rounded-lg shadow-sm transition-all focus:outline-none ${
                        isCopied 
                        ? 'bg-teal-50 border-teal-200 text-teal-700' 
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    {isCopied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            {t.headers.exportHtml}
                        </>
                    )}
                </button>
                <p className="text-xs text-slate-500 text-right max-w-xs whitespace-pre-line">
                    {t.headers.copyButtonInstruction}
                </p>
            </div>

            {/* Daily Targets & Blueprint */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-4">{t.headers.dailyBlueprint}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-teal-50 rounded-lg">
                        <p className="text-sm font-semibold text-teal-700">{t.headers.dailyCalories}</p>
                        <p className="text-3xl font-bold text-teal-900">{plan.daily_targets.calories.toLocaleString()}</p>
                        <p className="text-sm text-teal-800">kcal</p>
                    </div>
                    <div className="p-4 bg-sky-50 rounded-lg">
                        <p className="text-sm font-semibold text-sky-700">{t.headers.proteinGoal}</p>
                        <p className="text-3xl font-bold text-sky-900">{plan.daily_targets.protein_goal}</p>
                        <p className="text-sm text-sky-800">grams/day</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg">
                        <p className="text-sm font-semibold text-amber-700">{t.headers.carbLimit}</p>
                        <p className="text-3xl font-bold text-amber-900">&lt; {plan.daily_targets.carb_limit}</p>
                        <p className="text-sm text-amber-800">grams/day</p>
                    </div>
                </div>
                <div className="mt-6 p-4 bg-slate-100 rounded-md">
                    <p className="text-slate-700 font-semibold mb-2">{t.headers.twoNumbersPhilosophy}</p>
                    <p className="text-slate-600 text-sm">{plan.daily_targets.explanation}</p>
                </div>

                {/* Estimated Goal Date - Moved here */}
                {plan.goal_timeline && (
                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                        <p className="font-semibold text-slate-700 text-lg">
                            {t.headers.estimatedGoalDate} <span className="font-bold text-teal-600">{plan.goal_timeline.estimated_goal_date}</span>
                        </p>
                    </div>
                )}
            </div>
            
            {/* 3-Day Plan */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-4">{t.headers.threeDayPlan}</h2>
                <div className="space-y-6">
                    {plan.three_day_plan.map(day => (
                        <div key={day.day} className="border-t pt-4 first:border-t-0 first:pt-0">
                            <h3 className="font-bold text-lg text-slate-700">{day.day}</h3>
                            <div className="mt-2 space-y-4 pl-4">
                                {day.meals.map(meal => (
                                    <div key={meal.name} className="p-3 bg-slate-50 rounded-md">
                                        <p className="font-semibold text-slate-800">{meal.name}</p>
                                        <p className="text-sm text-slate-600 mt-1">{meal.description}</p>
                                        <p className="text-xs text-slate-500 mt-2">~{meal.protein}g Protein | ~{meal.carbs}g Carbs | ~{meal.calories} kcal</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="text-center pt-8">
                 <button 
                    onClick={onReset}
                    className="px-8 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                    {t.headers.createOldPlan}
                </button>
            </div>
        </div>
    );
};

export default MealPlanDisplay;
