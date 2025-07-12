// src/ai/flows/get-inventory-recommendations.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating inventory recommendations.
 *
 * - getInventoryRecommendations - A function that analyzes returns data to generate recommendations.
 * - GetInventoryRecommendationsInput - The input type for the getInventoryRecommendations function.
 * - GetInventoryRecommendationsOutput - The return type for the getInventoryRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendationSchema = z.object({
  id: z.string().describe("A unique ID for the recommendation, e.g., 'REC-001'"),
  type: z.enum(['inventory', 'supply chain']).describe("The type of recommendation."),
  title: z.string().describe("A concise title for the recommendation."),
  description: z.string().describe("A detailed description of the recommendation and the reasoning behind it."),
  impact: z.enum(['High', 'Medium', 'Low']).describe("The potential impact of addressing this recommendation."),
  confidence: z.number().min(0).max(100).describe("The AI's confidence level in this recommendation (0-100).")
});

const GetInventoryRecommendationsInputSchema = z.object({
  returnedItems: z.string().describe('A JSON string of recently returned items, including their name, category, condition, and return reason.'),
});

export type GetInventoryRecommendationsInput = z.infer<typeof GetInventoryRecommendationsInputSchema>;

const GetInventoryRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).describe('An array of inventory and supply chain recommendations.'),
});

export type GetInventoryRecommendationsOutput = z.infer<typeof GetInventoryRecommendationsOutputSchema>;

export async function getInventoryRecommendations(input: GetInventoryRecommendationsInput): Promise<GetInventoryRecommendationsOutput> {
  return getInventoryRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getInventoryRecommendationsPrompt',
  input: {schema: GetInventoryRecommendationsInputSchema},
  output: {schema: GetInventoryRecommendationsOutputSchema},
  prompt: `You are a proactive AI supply chain analyst for a large retail company.
  Your job is to analyze data from returned items and identify potential issues or opportunities in the inventory and supply chain.

  Analyze the following JSON data of returned items:
  {{{returnedItems}}}

  Based on your analysis, generate a list of proactive recommendations. Look for patterns such as:
  - High return rates for a specific product (might indicate a quality issue or poor product description).
  - Frequent returns due to "damaged" condition (might indicate a packaging or shipping problem).
  - Frequent returns for "incorrect size" (might suggest updating size guides).
  - A sudden increase in returns for a product category.

  For each recommendation, provide a clear title, a detailed description, its potential impact, and your confidence level.
  Return at least 2-3 distinct recommendations.
  `,
});

const getInventoryRecommendationsFlow = ai.defineFlow(
  {
    name: 'getInventoryRecommendationsFlow',
    inputSchema: GetInventoryRecommendationsInputSchema,
    outputSchema: GetInventoryRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
