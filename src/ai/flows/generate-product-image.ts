// src/ai/flows/generate-product-image.ts
'use server';
/**
 * @fileOverview An AI flow to generate a product image from a text description.
 *
 * - generateProductImage - A function that takes a text prompt and returns an image data URI.
 * - GenerateProductImageInput - The input type for the generateProductImage function.
 * - GenerateProductImageOutput - The return type for the generateProductImage function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateProductImageInputSchema = z.object({
  prompt: z.string().describe('A detailed description of the product image to generate.'),
});
export type GenerateProductImageInput = z.infer<typeof GenerateProductImageInputSchema>;

const GenerateProductImageOutputSchema = z.object({
  dataUri: z.string().describe('The generated image as a data URI.'),
});
export type GenerateProductImageOutput = z.infer<typeof GenerateProductImageOutputSchema>;


export async function generateProductImage(input: GenerateProductImageInput): Promise<GenerateProductImageOutput> {
  return generateProductImageFlow(input);
}

const generateProductImageFlow = ai.defineFlow(
  {
    name: 'generateProductImageFlow',
    inputSchema: GenerateProductImageInputSchema,
    outputSchema: GenerateProductImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      // IMPORTANT: This specific model is for image generation.
      model: googleAI.model('gemini-2.0-flash-preview-image-generation'),
      prompt: `A professional, high-resolution product photograph of the following item, on a clean, white studio background: ${input.prompt}`,
      config: {
        // You must request both modalities.
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
        throw new Error("Image generation failed to produce an image.");
    }

    return { dataUri: media.url };
  }
);
