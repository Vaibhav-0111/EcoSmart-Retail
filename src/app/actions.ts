"use server";

import { recommendReturnedItemAction, type RecommendReturnedItemActionInput, type RecommendReturnedItemActionOutput } from '@/ai/flows/recommend-returned-item-action';
import { identifyProductFromImage, type IdentifyProductFromImageInput, type IdentifyProductFromImageOutput } from '@/ai/flows/identify-product-from-image';
import { generateSustainabilityReport, type GenerateSustainabilityReportInput, type GenerateSustainabilityReportOutput } from '@/ai/flows/generate-sustainability-report';
import { getInventoryRecommendations, type GetInventoryRecommendationsInput, type GetInventoryRecommendationsOutput } from '@/ai/flows/get-inventory-recommendations';
import { diagnoseReturnedItem, type DiagnoseReturnedItemInput, type DiagnoseReturnedItemOutput } from '@/ai/flows/diagnose-returned-item';
import { forecastReturns, type ForecastReturnsInput, type ForecastReturnsOutput } from '@/ai/flows/forecast-returns';
import { generateProductImage, type GenerateProductImageInput, type GenerateProductImageOutput } from '@/ai/flows/generate-product-image';
import { describeImage, type DescribeImageInput, type DescribeImageOutput } from '@/ai/flows/describe-image';
import { textToSpeech, type TextToSpeechInput, type TextToSpeechOutput } from '@/ai/flows/text-to-speech';
import { generateResaleListing, type GenerateResaleListingInput, type GenerateResaleListingOutput } from '@/ai/flows/generate-resale-listing';


export async function getRecommendationAction(input: RecommendReturnedItemActionInput): Promise<RecommendReturnedItemActionOutput> {
  return await recommendReturnedItemAction(input);
}

export async function identifyProductAction(input: IdentifyProductFromImageInput): Promise<IdentifyProductFromImageOutput> {
    return await identifyProductFromImage(input);
}

export async function generateReportAction(input: GenerateSustainabilityReportInput): Promise<GenerateSustainabilityReportOutput> {
    return await generateReportAction(input);
}

export async function getRecommendationsAction(input: GetInventoryRecommendationsInput): Promise<GetInventoryRecommendationsOutput> {
    return await getInventoryRecommendations(input);
}

export async function diagnoseItemAction(input: DiagnoseReturnedItemInput): Promise<DiagnoseReturnedItemOutput> {
    return await diagnoseReturnedItem(input);
}

export async function forecastReturnsAction(input: ForecastReturnsInput): Promise<ForecastReturnsOutput> {
    return await forecastReturns(input);
}

export async function generateProductImageAction(input: GenerateProductImageInput): Promise<GenerateProductImageOutput> {
    return await generateProductImage(input);
}

export async function describeImageAction(input: DescribeImageInput): Promise<DescribeImageOutput> {
    return await describeImage(input);
}

export async function textToSpeechAction(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
    return await textToSpeech(input);
}

export async function generateResaleListingAction(input: GenerateResaleListingInput): Promise<GenerateResaleListingOutput> {
    return await generateResaleListing(input);
}
