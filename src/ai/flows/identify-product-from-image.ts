// src/ai/flows/identify-product-from-image.ts
'use server';
/**
 * @fileOverview An AI flow to identify a product from an image.
 *
 * - identifyProductFromImage - A function that takes an image and returns product details.
 * - IdentifyProductFromImageInput - The input type for the identifyProductFromImage function.
 * - IdentifyProductFromImageOutput - The return type for the identifyProductFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyProductFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyProductFromImageInput = z.infer<typeof IdentifyProductFromImageInputSchema>;

const IdentifyProductFromImageOutputSchema = z.object({
  productName: z.string().describe('The identified name of the product.'),
  category: z.enum(['electronics', 'clothing', 'home goods', 'toys', 'other']).describe('The most likely category for the product.'),
  estimatedValue: z.number().describe('The estimated retail value of the product in USD. Provide only a number.'),
});
export type IdentifyProductFromImageOutput = z.infer<typeof IdentifyProductFromImageOutputSchema>;

export async function identifyProductFromImage(input: IdentifyProductFromImageInput): Promise<IdentifyProductFromImageOutput> {
  return identifyProductFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyProductPrompt',
  input: {schema: IdentifyProductFromImageInputSchema},
  output: {schema: IdentifyProductFromImageOutputSchema},
  prompt: `You are an expert product identifier for a large retail store.
Your task is to identify the product in the provided image, determine its category, and estimate its retail value in USD.

Provide a concise product name, select the most appropriate category, and give an estimated value.

Photo: {{media url=photoDataUri}}`,
});

const identifyProductFromImageFlow = ai.defineFlow(
  {
    name: 'identifyProductFromImageFlow',
    inputSchema: IdentifyProductFromImageInputSchema,
    outputSchema: IdentifyProductFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
