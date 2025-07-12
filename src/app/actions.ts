"use server";

import { learnUserPreferences, type LearnUserPreferencesInput, type LearnUserPreferencesOutput } from '@/ai/flows/learn-user-preferences';
import { providePersonalizedProductSuggestions, type PersonalizedProductSuggestionsInput, type PersonalizedProductSuggestionsOutput } from '@/ai/flows/provide-personalized-product-suggestions';
import { recommendReturnedItemAction, type RecommendReturnedItemActionInput, type RecommendReturnedItemActionOutput } from '@/ai/flows/recommend-returned-item-action';

export async function getRecommendationAction(input: RecommendReturnedItemActionInput): Promise<RecommendReturnedItemActionOutput> {
  return await recommendReturnedItemAction(input);
}

export async function learnPreferencesAction(input: LearnUserPreferencesInput): Promise<LearnUserPreferencesOutput> {
  return await learnUserPreferences(input);
}

export async function getSuggestionsAction(input: PersonalizedProductSuggestionsInput): Promise<PersonalizedProductSuggestionsOutput> {
  return await providePersonalizedProductSuggestions(input);
}
