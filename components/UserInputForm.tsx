import React, { useState, useMemo } from 'react';
import type { FormData, UserData, FamilyMember } from '../types';
import { GOAL_OPTIONS, CARB_PREFERENCE_OPTIONS, FASTING_PREFERENCE_OPTIONS, MEALS_PER_DAY_OPTIONS, INITIAL_USER_STATE, FOOD_QUALITY_PREFERENCE_OPTIONS, FOOD_CATEGORIES, MEAL_VARIETY_OPTIONS, FLAVOR_PROFILE_OPTIONS } from '../constants';

interface UserFormSectionProps {
    user: UserData | FamilyMember;
    onUpdate: (data: Partial<UserData | FamilyMember>) => void;
    isFamilyMember?: boolean;
    title: string;
    primaryUserPrefs?: {
        food_quality_preference: UserData['food_quality_preference'];
        selected_foods: UserData['selected_foods'];
        flavor_profile: UserData['flavor_profile'];
        allow_snacks: UserData['allow_snacks'];
        meal_variety: UserData['meal_variety'];
    };
}

const UserFormSection: React.FC<UserFormSectionProps> = ({ 
    user, 
    onUpdate, 
    isFamilyMember = false, 
    title,
    primaryUserPrefs 
}) => {
    // Determine current effective preferences based on sync state
    const isSynced = isFamilyMember && (user as FamilyMember).sync_with_primary;
    
    const effectiveFoodQuality = isSynced && primaryUserPrefs ? primaryUserPrefs.food_quality_preference : user.food_quality_preference;
    const effectiveSelectedFoods = isSynced && primaryUserPrefs ? primaryUserPrefs.selected_foods : user.selected_foods;
    const effectiveFlavorProfile = isSynced && primaryUserPrefs ? primaryUserPrefs.flavor_profile : user.flavor_profile;
    const effectiveAllowSnacks = isSynced && primaryUserPrefs ? primaryUserPrefs.allow_snacks : user.allow_snacks;
    const effectiveMealVariety = isSynced && primaryUserPrefs ? primaryUserPrefs.meal_variety : user.meal_variety;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (name === 'allow_snacks') {
            if (isSynced) return;
            onUpdate({ allow_snacks: value === 'true' });
            return;
        }

        if (name === 'sync_with_primary') {
            const checkbox = e.target as HTMLInputElement;
            onUpdate({ sync_with_primary: checkbox.checked });
            return;
        }
        
        const parsedValue = (name === 'age' || name.startsWith('weight') || name.startsWith('height') || name === 'meals_per_day') && value !== '' ? parseInt(value, 10) : value;
        
        if (name === 'fasting_preference') {
            const updates: Partial<UserData | FamilyMember> = { fasting_preference: value as UserData['fasting_preference'] };
            if (value === 'OMAD (One Meal A Day)') {
                updates.meals_per_day = 1;
            } else if (user.fasting_preference === 'OMAD (One Meal A Day)') {
                updates.meals_per_day = '';
            }
            onUpdate(updates);
        } else {
             onUpdate({ [name]: parsedValue });
        }
    };

    const handleCheckboxChange = (category: string, item: string, checked: boolean) => {
        if (isSynced) return;

        const currentSelections = user.selected_foods || {};
        const categorySelection = currentSelections[category] || [];
        
        let newCategorySelection;
        if (checked) {
            newCategorySelection = [...categorySelection, item];
        } else {
            newCategorySelection = categorySelection.filter(food => food !== item);
        }

        const newSelections = { ...currentSelections };
        if (newCategorySelection.length > 0) {
            newSelections[category] = newCategorySelection;
        } else {
            delete newSelections[category];
        }
        
        onUpdate({ selected_foods: newSelections });
    };

    const handleCategoryToggle = (category: string, items: string[]) => {
        if (isSynced) return;

        const currentSelections = user.selected_foods || {};
        const categorySelection = currentSelections[category] || [];
        const areAllSelected = items.length === categorySelection.length && items.every(item => categorySelection.includes(item));
        
        const newSelections = { ...currentSelections };
        if (areAllSelected) {
            delete newSelections[category];
        } else {
            newSelections[category] = items;
        }
        onUpdate({ selected_foods: newSelections });
    };
    
    const { totalSelected, totalItems } = useMemo(() => {
        const selected = Object.values(effectiveSelectedFoods || {}).flat().length;
        const total = Object.values(FOOD_CATEGORIES).flat().length;
        return { totalSelected: selected, totalItems: total };
    }, [effectiveSelectedFoods]);

    const handleGlobalToggle = () => {
        if (isSynced) return;
        
        if (totalSelected === totalItems) {
            onUpdate({ selected_foods: {} });
        } else {
            const allSelected = Object.fromEntries(
                Object.entries(FOOD_CATEGORIES).map(([category, items]) => [category, items])
            );
            onUpdate({ selected_foods: allSelected });
        }
    };

    const isOMAD = user.fasting_preference === 'OMAD (One Meal A Day)';

    return (
        <div className="p-6 border border-slate-200 rounded-lg bg-slate-50/50">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isFamilyMember && (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-600">Name</label>
                        <input type="text" name="name" value={(user as FamilyMember).name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required/>
                    </div>
                )}
                 <div>
                    <label className="block text-sm font-medium text-slate-600">Biological Sex</label>
                    <select name="sex" value={user.sex} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required>
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-600">Age</label>
                    <input type="number" name="age" value={user.age} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required/>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600">Current Weight</label>
                    <div className="flex items-center mt-1">
                        <input type="number" name="weight" value={user.weight} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-l-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required/>
                        <select name="weight_unit" value={user.weight_unit} onChange={handleInputChange} className="px-3 py-2 bg-slate-100 border-t border-b border-r border-slate-300 rounded-r-md focus:outline-none">
                            <option value="lbs">lbs</option>
                            <option value="kg">kg</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600">Target Weight ({user.weight_unit})</label>
                    <input type="number" name="target_weight" value={user.target_weight} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required/>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-600">Height</label>
                    <div className="flex items-center gap-4 mt-1">
                        <select name="height_unit" value={user.height_unit} onChange={handleInputChange} className="px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none">
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

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-600">Primary Goal</label>
                    <select name="goal" value={user.goal} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required>
                        <option value="">Select a goal...</option>
                        {GOAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-600">Carb Preference</label>
                    <select name="carb_preference" value={user.carb_preference} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required>
                        <option value="">Select carb level...</option>
                        {CARB_PREFERENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-600">Fasting Preference</label>
                    <select name="fasting_preference" value={user.fasting_preference} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required>
                        <option value="">Select fasting style...</option>
                        {FASTING_PREFERENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <p className="text-xs text-slate-500 mt-2">OMAD means eating one nutrient-dense meal per day — recommended for experienced or advanced users.</p>
                </div>
                 <div className={`transition-opacity duration-300 ease-in-out ${isOMAD ? 'opacity-100' : 'opacity-100'}`}>
                    <label className="block text-sm font-medium text-slate-600">Meals Per Day</label>
                    {isOMAD ? (
                         <div className="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-500 italic">
                            OMAD includes one meal per day — this setting is fixed.
                        </div>
                    ) : (
                        <select name="meals_per_day" value={user.meals_per_day} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required>
                            <option value="">Select...</option>
                            {MEALS_PER_DAY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    )}
                </div>

                {/* SYNC OPTION FOR FAMILY MEMBERS */}
                {isFamilyMember && (
                    <div className="md:col-span-2 pt-4 mt-4 border-t border-slate-200">
                        <label className="flex items-center space-x-3 p-4 bg-lime-50 rounded-lg border border-lime-200 cursor-pointer hover:bg-lime-100 transition-colors">
                            <input
                                type="checkbox"
                                name="sync_with_primary"
                                checked={(user as FamilyMember).sync_with_primary}
                                onChange={handleInputChange}
                                className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                            />
                            <div>
                                <span className="font-bold text-slate-800">Use primary user's food preferences</span>
                                <p className="text-xs text-slate-600">Enable this if you share the same grocery list, food quality, flavor profiles, and snack choices as the primary account holder.</p>
                            </div>
                        </label>
                    </div>
                )}

                <div className={`md:col-span-2 transition-all ${isSynced ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
                    <label className="block text-sm font-medium text-slate-600">How important is food quality to you when building your grocery list and meal plan?</label>
                    <p className="text-xs text-slate-500 mt-1">This helps us tailor recommendations to your budget. E.g., 'High Quality' prioritizes organic/grass-fed, 'Above Average' uses natural/antibiotic-free options, and 'Cost-Effective' focuses on standard ingredients.</p>
                    <select 
                        name="food_quality_preference" 
                        value={effectiveFoodQuality} 
                        onChange={handleInputChange} 
                        disabled={isSynced}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" 
                        required={!isSynced}
                    >
                        <option value="">Select an approach...</option>
                        {FOOD_QUALITY_PREFERENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                
                {/* Food Preferences Checklist */}
                <div className={`md:col-span-2 space-y-4 transition-all ${isSynced ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
                    <div>
                        <label className="block text-sm font-medium text-slate-600">Which types of foods do you want included in your meal plan?</label>
                        <p className="text-xs text-slate-500 mt-1">Select all that apply. Your grocery list and recipes will be built using these choices.</p>
                    </div>
                    {!isSynced && (
                        <div className="mb-4">
                            <button type="button" onClick={handleGlobalToggle} className="w-full text-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                {totalSelected === totalItems ? 'Deselect all foods' : 'Select all foods across all categories'} ({totalSelected} / {totalItems} selected)
                            </button>
                        </div>
                    )}
                    <div className="space-y-4">
                        {Object.entries(FOOD_CATEGORIES).map(([category, items]) => {
                            const categorySelection = effectiveSelectedFoods?.[category] || [];
                            const areAllSelected = items.length > 0 && categorySelection.length === items.length;
                            
                            const isCondiments = category.startsWith('🌶️');
                            
                            return (
                                <div key={category}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-sm text-slate-700">{category}</h4>
                                        {!isSynced && (
                                            <button
                                                type="button"
                                                onClick={() => handleCategoryToggle(category, items)}
                                                className="text-xs font-medium text-teal-600 hover:text-teal-800"
                                                aria-label={`${areAllSelected ? 'Deselect' : 'Select'} all in ${category}`}
                                            >
                                                {areAllSelected ? 'Deselect all' : 'Select all'}
                                            </button>
                                        )}
                                    </div>
                                    { isCondiments && <p className="text-xs text-slate-500 mb-2">Select the condiments and seasonings you’d like to include. Only healthy, real-ingredient options will be used in your recipes.</p>}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {items.map(item => (
                                            <label key={item} className={`flex items-center space-x-2 text-sm p-2 rounded-md ${isSynced ? '' : 'hover:bg-slate-100 cursor-pointer'}`}>
                                                <input
                                                    type="checkbox"
                                                    value={item}
                                                    checked={categorySelection.includes(item)}
                                                    onChange={(e) => handleCheckboxChange(category, item, e.target.checked)}
                                                    disabled={isSynced}
                                                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                                />
                                                <span className="text-slate-700">{item.split('(')[0].trim()}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Flavor Profile Preference */}
                <div className={`md:col-span-2 transition-all ${isSynced ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
                    <label htmlFor="flavor_profile" className="block text-sm font-medium text-slate-600">Flavor Profile Preference</label>
                    <p className="text-xs text-slate-500 mt-1">How do you prefer your meals to taste? We’ll adjust seasonings and recipe suggestions to match your flavor profile.</p>
                    <select
                        id="flavor_profile"
                        name="flavor_profile"
                        value={effectiveFlavorProfile}
                        onChange={handleInputChange}
                        disabled={isSynced}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        required={!isSynced}
                    >
                        <option value="">Select a flavor profile...</option>
                        {FLAVOR_PROFILE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* Snacks Between Meals */}
                <div className={`md:col-span-2 space-y-2 transition-all ${isSynced ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
                    <label className="block text-sm font-medium text-slate-600">Snacks Between Meals</label>
                    <p className="text-xs text-slate-500 mt-1">If you choose snacks, we’ll keep them simple and on-plan — high in protein, low in sugar — and automatically factor them into your daily meal plan and grocery list.</p>
                    <div className="mt-2 space-y-2 sm:space-y-0 sm:flex sm:space-x-4">
                        <label className="flex items-center p-3 border border-slate-200 rounded-md has-[:checked]:bg-teal-50 has-[:checked]:border-teal-300 flex-1 cursor-pointer">
                            <input
                                type="radio"
                                name="allow_snacks"
                                value="true"
                                checked={effectiveAllowSnacks === true}
                                onChange={handleInputChange}
                                disabled={isSynced}
                                className="h-4 w-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                            />
                            <span className="ml-3 text-sm font-medium text-slate-800">Yes – include simple snacks between meals</span>
                        </label>
                        <label className="flex items-center p-3 border border-slate-200 rounded-md has-[:checked]:bg-teal-50 has-[:checked]:border-teal-300 flex-1 cursor-pointer">
                            <input
                                type="radio"
                                name="allow_snacks"
                                value="false"
                                checked={effectiveAllowSnacks === false}
                                onChange={handleInputChange}
                                disabled={isSynced}
                                className="h-4 w-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                            />
                            <span className="ml-3 text-sm font-medium text-slate-800">No – meals only (no snacks)</span>
                        </label>
                    </div>
                </div>


                {/* Meal Variety Preference */}
                <div className={`md:col-span-2 space-y-2 transition-all ${isSynced ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
                    <label className="block text-sm font-medium text-slate-600">How much variety would you like in your meal plan?</label>
                    <p className="text-xs text-slate-500 mt-1">This helps us decide if we should repeat meals for easier prep or rotate recipes for more variety.</p>
                    <div className="mt-2 space-y-2">
                        {MEAL_VARIETY_OPTIONS.map(option => (
                            <label key={option.id} className="flex items-start p-3 border border-slate-200 rounded-md has-[:checked]:bg-teal-50 has-[:checked]:border-teal-300">
                                <input
                                    type="radio"
                                    name="meal_variety"
                                    value={option.id}
                                    checked={effectiveMealVariety === option.id}
                                    onChange={handleInputChange}
                                    disabled={isSynced}
                                    className="h-4 w-4 mt-1 text-teal-600 border-slate-300 focus:ring-teal-500"
                                />
                                <div className="ml-3 text-sm">
                                    <span className="font-medium text-slate-800">{option.label}</span>
                                    <p className="text-slate-500">{option.description}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>


                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-600">Food Preferences, Dislikes, or Allergies</label>
                    <textarea name="food_preferences" value={user.food_preferences} onChange={handleInputChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" placeholder="e.g., love steak, dislike fish, allergic to shellfish. I also enjoy a daily smoothie with whey protein and organic peanut butter."></textarea>
                </div>
            </div>
        </div>
    )
}

interface UserInputFormProps {
    initialData: FormData;
    onSubmit: (data: FormData) => void;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<FormData>(initialData);

    const handlePrimaryUserUpdate = (update: Partial<UserData>) => {
        setFormData(prev => ({ ...prev, primary_user: { ...prev.primary_user, ...update } }));
    };

    const handleFamilyMemberUpdate = (id: string, update: Partial<FamilyMember>) => {
        setFormData(prev => ({
            ...prev,
            family_members: prev.family_members.map(member => member.id === id ? { ...member, ...update } : member)
        }));
    };
    
    const addFamilyMember = () => {
        const newMember: FamilyMember = {
            id: Date.now().toString(),
            name: '',
            ...INITIAL_USER_STATE,
            sync_with_primary: false,
        };
        setFormData(prev => ({ ...prev, family_members: [...prev.family_members, newMember] }));
    };

    const removeFamilyMember = (id: string) => {
        setFormData(prev => ({ ...prev, family_members: prev.family_members.filter(member => member.id !== id) }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Final sync of data before submission for any members who have the toggle on
        const syncedData: FormData = {
            ...formData,
            family_members: formData.family_members.map(member => {
                if (member.sync_with_primary) {
                    return {
                        ...member,
                        food_quality_preference: formData.primary_user.food_quality_preference,
                        selected_foods: formData.primary_user.selected_foods,
                        flavor_profile: formData.primary_user.flavor_profile,
                        allow_snacks: formData.primary_user.allow_snacks,
                        meal_variety: formData.primary_user.meal_variety,
                    };
                }
                return member;
            })
        };
        
        onSubmit(syncedData);
    };

    const primaryUserPrefs = useMemo(() => ({
        food_quality_preference: formData.primary_user.food_quality_preference,
        selected_foods: formData.primary_user.selected_foods,
        flavor_profile: formData.primary_user.flavor_profile,
        allow_snacks: formData.primary_user.allow_snacks,
        meal_variety: formData.primary_user.meal_variety,
    }), [
        formData.primary_user.food_quality_preference, 
        formData.primary_user.selected_foods,
        formData.primary_user.flavor_profile,
        formData.primary_user.allow_snacks,
        formData.primary_user.meal_variety
    ]);

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <UserFormSection user={formData.primary_user} onUpdate={handlePrimaryUserUpdate} title="Your Information" />

            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50/50">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-700">Family Members</h3>
                    <div className="flex items-center">
                        <span className="mr-3 text-sm font-medium text-slate-600">Include Family?</span>
                        <label htmlFor="toggle-family" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" id="toggle-family" className="sr-only peer" checked={formData.include_family} onChange={e => setFormData(prev => ({ ...prev, include_family: e.target.checked }))} />
                                <div className="block bg-slate-300 w-14 h-8 rounded-full"></div>
                                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform duration-300 ease-in-out peer-checked:translate-x-6 peer-checked:bg-teal-500"></div>
                            </div>
                        </label>
                    </div>
                </div>

                {formData.include_family && (
                    <div className="mt-6 space-y-6">
                        {formData.family_members.map((member) => (
                           <div key={member.id} className="relative pt-6">
                            <UserFormSection 
                                user={member}
                                onUpdate={(update) => handleFamilyMemberUpdate(member.id, update)}
                                isFamilyMember={true}
                                title={`${member.name || 'Family Member'}'s Information`}
                                primaryUserPrefs={primaryUserPrefs}
                            />
                            <button
                                type="button"
                                onClick={() => removeFamilyMember(member.id)}
                                className="absolute top-0 right-0 mt-1 mr-1 px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full hover:bg-red-200"
                            >
                                Remove
                            </button>
                           </div>
                        ))}
                         <button
                            type="button"
                            onClick={addFamilyMember}
                            className="w-full mt-4 px-4 py-2 border-2 border-dashed border-slate-300 text-slate-600 font-semibold rounded-lg hover:bg-slate-100 hover:border-slate-400 focus:outline-none"
                        >
                            + Add Another Family Member
                        </button>
                    </div>
                )}
            </div>

            <div className="pt-5">
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                    Generate My Meal Plan
                </button>
            </div>
        </form>
    );
};

export default UserInputForm;