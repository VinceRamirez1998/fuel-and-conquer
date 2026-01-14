
import React, { useState, useEffect } from 'react';
import type { FormData, UserData } from '../types';
import { 
    GOAL_OPTIONS, 
    CARB_PREFERENCE_OPTIONS, 
    PROTEIN_OPTIONS,
    TRANSLATIONS
} from '../constants';

interface UserInputFormProps {
    initialData: FormData;
    onSubmit: (data: FormData) => void;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<FormData>(initialData);
    
    // Sync language when it changes in parent (App.tsx)
    useEffect(() => {
        setFormData(prev => ({ ...prev, language: initialData.language }));
    }, [initialData.language]);

    // Derived from formData for easy access
    const language = formData.language;
    const t = TRANSLATIONS[language];
    const user = formData.user;

    const handleUpdate = (update: Partial<UserData>) => {
        setFormData(prev => ({ ...prev, user: { ...prev.user, ...update } }));
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Only parse specific numeric fields as integers. 
        const numericFields = ['age', 'weight', 'target_weight', 'height_ft', 'height_in', 'height_cm'];
        
        let parsedValue: string | number = value;
        if (numericFields.includes(name) && value !== '') {
            parsedValue = parseInt(value, 10);
        }

        handleUpdate({ [name]: parsedValue });
    };

    const handleProteinToggle = (protein: string) => {
        const current = user.selected_proteins || [];
        if (current.includes(protein)) {
            handleUpdate({ selected_proteins: current.filter(p => p !== protein) });
        } else {
            handleUpdate({ selected_proteins: [...current, protein] });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Determine max weight based on unit
    const maxWeight = user.weight_unit === 'kg' ? 300 : 700;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-lg shadow-lg relative">
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50/50">
                <h3 className="text-xl font-semibold text-slate-700 mb-4">{t.headers.yourInfo}</h3>
                
                <div className="grid grid-cols-1 gap-4">
                     {/* Row 1: Gender & Age */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600">{t.labels.sex}</label>
                            <select name="sex" value={user.sex} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required>
                                <option value="">{t.labels.select}</option>
                                <option value="male">{t.options.sex.male}</option>
                                <option value="female">{t.options.sex.female}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600">{t.labels.age}</label>
                            <select name="age" value={user.age} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required>
                                <option value="">{t.labels.select}</option>
                                {Array.from({ length: 100 }, (_, i) => i + 1).map(age => (
                                    <option key={age} value={age}>{age}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Row 2: Weights */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600">{t.labels.currentWeight}</label>
                            <div className="flex items-center mt-1">
                                <input 
                                    type="number" 
                                    name="weight" 
                                    value={user.weight} 
                                    onChange={handleInputChange} 
                                    max={maxWeight}
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-l-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" 
                                    required
                                />
                                <select name="weight_unit" value={user.weight_unit} onChange={handleInputChange} className="px-3 py-2 bg-slate-100 border-t border-b border-r border-slate-300 rounded-r-md focus:outline-none cursor-pointer">
                                    <option value="lbs">lbs</option>
                                    <option value="kg">kg</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-600">{t.labels.targetWeight} ({user.weight_unit})</label>
                            <input 
                                type="number" 
                                name="target_weight" 
                                value={user.target_weight} 
                                onChange={handleInputChange} 
                                max={maxWeight}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" 
                                required
                            />
                        </div>
                    </div>

                    {/* Row 3: Height */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600">{t.labels.height}</label>
                        <div className="flex items-center gap-4 mt-1">
                            <select name="height_unit" value={user.height_unit} onChange={handleInputChange} className="px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none cursor-pointer">
                                <option value="ft">ft/in</option>
                                <option value="cm">cm</option>
                            </select>
                            {user.height_unit === 'ft' ? (
                                <div className="flex-grow grid grid-cols-2 gap-2">
                                    <input type="number" name="height_ft" placeholder="ft" value={user.height_ft} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                                    <input type="number" name="height_in" placeholder="in" value={user.height_in} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                                </div>
                            ) : (
                                <input type="number" name="height_cm" placeholder="cm" value={user.height_cm} onChange={handleInputChange} className="flex-grow w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600">{t.labels.primaryGoal}</label>
                        <select name="goal" value={user.goal} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required>
                            <option value="">{t.labels.selectGoal}</option>
                            {GOAL_OPTIONS.map(opt => <option key={opt} value={opt}>{t.options.goals[opt] || opt}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-600">{t.labels.carbPref}</label>
                        <select name="carb_preference" value={user.carb_preference} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required>
                            <option value="">{t.labels.selectCarb}</option>
                            {CARB_PREFERENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{t.options.carbs[opt] || opt}</option>)}
                        </select>
                    </div>

                    {/* Protein Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600">{t.labels.proteinSelect}</label>
                        <p className="text-xs text-slate-500 mt-1 mb-2">{t.labels.proteinDesc}</p>
                        <div className="grid grid-cols-2 gap-3">
                            {PROTEIN_OPTIONS.map(protein => (
                                <label key={protein} className="flex items-center space-x-2 text-sm p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer has-[:checked]:bg-teal-50 has-[:checked]:border-teal-300">
                                    <input
                                        type="checkbox"
                                        checked={user.selected_proteins.includes(protein)}
                                        onChange={() => handleProteinToggle(protein)}
                                        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                    />
                                    <span className="text-slate-700 font-medium">{t.options.proteins[protein] || protein}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600">{t.labels.foodPrefs}</label>
                        <textarea name="food_preferences" value={user.food_preferences} onChange={handleInputChange} rows={2} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" placeholder={t.labels.foodPrefsPlaceholder}></textarea>
                    </div>
                </div>
            </div>

            <div className="pt-5">
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                    {t.headers.generateBtn}
                </button>
            </div>
        </form>
    );
};

export default UserInputForm;
