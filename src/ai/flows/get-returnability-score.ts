// src/ai/flows/get-returnability-score.ts
'use server';
/**
 * @fileOverview An AI flow to calculate a "returnability score" for products.
 *
 * - getReturnabilityScore - A function that analyzes product data and return history to predict return risk.
 * - GetReturnabilityScoreInput - The input type for the getReturnabilityScore function.
 * - GetReturnabilityScoreOutput - The return type for the getReturnabilityScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductScoreSchema = z.object({
  productId: z.string().describe("The unique ID of the product."),
  productName: z.string().describe("The name of the product."),
  returnRisk: z.enum(['Low', 'Medium', 'High']).describe("The calculated return risk for the product."),
  reasoning: z.string().describe("A brief explanation for the assigned risk score, based on return patterns."),
});

const GetReturnabilityScoreInputSchema = z.object({
  productCatalog: z.string().describe("A JSON string of the entire product catalog."),
  returnHistory: z.string().describe("A JSON string of all returned items."),
});
export type GetReturnabilityScoreInput = z.infer<typeof GetReturnabilityScoreInputSchema>;

const GetReturnabilityScoreOutputSchema = z.object({
  scores: z.array(ProductScoreSchema).describe("An array of products with their returnability scores."),
});
export type GetReturnabilityScoreOutput = z.infer<typeof GetReturnabilityScoreOutputSchema>;

export async function getReturnabilityScore(input: GetReturnabilityScoreInput): Promise<GetReturnabilityScoreOutput> {
  return getReturnabilityScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getReturnabilityScorePrompt',
  input: {schema: GetReturnabilityScoreInputSchema},
  output: {schema: GetReturnabilityScoreOutputSchema},
  prompt: `You are a retail risk analysis AI. Your task is to analyze a product catalog and a history of returned items to calculate a "Returnability Score" for each product. The score should predict the likelihood of a product being returned.

  The score should be one of: 'Low', 'Medium', or 'High'.

  A 'High' risk should be assigned to any product that appears MORE THAN ONCE in the return history.
  A 'Medium' risk should be assigned to any product that appears EXACTLY ONCE in the return history.
  A 'Low' risk should be assigned to any product with no return history.

  Analyze the following data:
  Product Catalog: {{{productCatalog}}}
  Return History: {{{returnHistory}}}

  Look for patterns like:
  - A specific product having a high number of returns compared to others. This is the primary signal for a 'High' risk score.
  - Products frequently returned with 'damaged' condition.
  - Products with many returns for reasons like 'wrong size' or 'doesn't match description'.
  
  Provide a 'reasoning' for each score that reflects the number of times it was returned.
  `,
});

const getReturnabilityScoreFlow = ai.defineFlow(
  {
    name: 'getReturnabilityScoreFlow',
    inputSchema: GetReturnabilityScoreInputSchema,
    outputSchema: GetReturnabilityScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
