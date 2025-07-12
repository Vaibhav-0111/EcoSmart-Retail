"use server";

import { learnUserPreferences, type LearnUserPreferencesInput, type LearnUserPreferencesOutput } from '@/ai/flows/learn-user-preferences';
import { providePersonalizedProductSuggestions, type PersonalizedProductSuggestionsInput, type PersonalizedProductSuggestionsOutput } from '@/ai/flows/provide-personalized-product-suggestions';
import { recommendReturnedItemAction, type RecommendReturnedItemActionInput, type RecommendReturnedItemActionOutput } from '@/ai/flows/recommend-returned-item-action';
import { identifyProductFromImage, type IdentifyProductFromImageInput, type IdentifyProductFromImageOutput } from '@/ai/flows/identify-product-from-image';
import { generateSustainabilityReport, type GenerateSustainabilityReportInput, type GenerateSustainabilityReportOutput } from '@/ai/flows/generate-sustainability-report';
import { getInventoryRecommendations, type GetInventoryRecommendationsInput, type GetInventoryRecommendationsOutput } from '@/ai/flows/get-inventory-recommendations';


export async function getRecommendationAction(input: RecommendReturnedItemActionInput): Promise<RecommendReturnedItemActionOutput> {
  return await recommendReturnedItemAction(input);
}

export async function learnPreferencesAction(input: LearnUserPreferencesInput): Promise<LearnUserPreferencesOutput> {
  return await learnUserPreferences(input);
}

export async function getSuggestionsAction(input: PersonalizedProductSuggestionsInput): Promise<PersonalizedProductSuggestionsOutput> {
  return await providePersonalizedProductSuggestions(input);
}

export async function identifyProductAction(input: IdentifyProductFromImageInput): Promise<IdentifyProductFromImageOutput> {
    return await identifyProductFromImage(input);
}

export async function generateReportAction(input: GenerateSustainabilityReportInput): Promise<GenerateSustainabilityReportOutput> {
    return await generateSustainabilityReport(input);
}

export async function getRecommendationsAction(input: GetInventoryRecommendationsInput): Promise<GetInventoryRecommendationsOutput> {
    return await getInventoryRecommendations(input);
}
