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
  type: z.enum(['inventory', 'supply chain', 'product quality', 'customer experience']).describe("The type of recommendation."),
  title: z.string().describe("A concise title for the recommendation."),
  description: z.string().describe("A detailed description of the recommendation and the reasoning behind it, referencing specific products if applicable."),
  impact: z.enum(['High', 'Medium', 'Low']).describe("The potential impact of addressing this recommendation."),
  confidence: z.number().min(0).max(100).describe("The AI's confidence level in this recommendation (0-100)."),
  relatedProduct: z.string().optional().describe("The name of the specific product this recommendation relates to, if any.")
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
  prompt: `You are a proactive AI supply chain and retail operations analyst for a large retail company.
  Your job is to analyze data from returned items and identify potential issues or opportunities in inventory, supply chain, and product quality.

  Analyze the following JSON data of returned items:
  {{{returnedItems}}}

  Based on your analysis, generate a list of proactive recommendations. Look for patterns such as:
  - High return rates for a specific product (might indicate a quality issue or poor product description). If you find this, include the product name in 'relatedProduct'.
  - Frequent returns due to "damaged" condition for a specific item (might indicate a packaging or shipping problem). If you find this, include the product name in 'relatedProduct'.
  - Frequent returns for "incorrect size" for a clothing item (might suggest updating size guides on the product page). If you find this, include the product name in 'relatedProduct'.
  - A sudden increase in returns for a product category.

  For each recommendation, provide a clear title, a detailed description, its potential impact, and your confidence level.
  If the recommendation is about a specific product, populate the 'relatedProduct' field.
  Return at least 2-4 distinct and specific recommendations. Make them actionable.
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
