// src/ai/flows/generate-resale-listing.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a product resale listing.
 *
 * - generateResaleListing - A function that takes product details and generates a listing.
 * - GenerateResaleListingInput - The input type for the generateResaleListing function.
 * - GenerateResaleListingOutput - The return type for the generateResaleListing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResaleListingInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category of the product.'),
  condition: z.string().describe('The condition of the product (e.g., new, used, damaged).'),
  value: z.number().describe('The original estimated retail value of the product in USD.'),
  returnReason: z.string().describe('The original reason the customer returned the product.'),
});
export type GenerateResaleListingInput = z.infer<typeof GenerateResaleListingInputSchema>;

const GenerateResaleListingOutputSchema = z.object({
    title: z.string().describe("A catchy, SEO-friendly title for the marketplace listing."),
    description: z.string().describe("A compelling and persuasive sales description for the product, highlighting its features and condition. This should be in Markdown format."),
    suggestedPrice: z.number().describe("A suggested resale price in USD, taking into account the condition and original value."),
});
export type GenerateResaleListingOutput = z.infer<typeof GenerateResaleListingOutputSchema>;

export async function generateResaleListing(input: GenerateResaleListingInput): Promise<GenerateResaleListingOutput> {
  return generateResaleListingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResaleListingPrompt',
  input: {schema: GenerateResaleListingInputSchema},
  output: {schema: GenerateResaleListingOutputSchema},
  prompt: `You are an expert e-commerce copywriter. Your task is to create a compelling marketplace listing for a returned item.

  Product Details:
  - Name: {{{productName}}}
  - Category: {{{category}}}
  - Condition: {{{condition}}}
  - Original Value: ${"{{value}}"}
  - Original Return Reason: {{{returnReason}}}

  Your Tasks:
  1.  **Title:** Create a catchy, SEO-friendly title for the listing.
  2.  **Description:** Write a persuasive description in Markdown. Be honest about the condition but focus on the value and benefits for the buyer. If it was returned for a minor reason like 'wrong size' or 'unwanted gift', emphasize that it's practically new.
  3.  **Suggested Price:** Recommend a new price in USD. It should be lower than the original value, especially if used or damaged, but competitive. For items in 'new' condition, you can suggest a price close to the original value.
  `,
});

const generateResaleListingFlow = ai.defineFlow(
  {
    name: 'generateResaleListingFlow',
    inputSchema: GenerateResaleListingInputSchema,
    outputSchema: GenerateResaleListingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
