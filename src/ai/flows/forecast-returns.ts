// src/ai/flows/forecast-returns.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for forecasting future returns.
 *
 * - forecastReturns - A function that analyzes historical data to predict future returns.
 * - ForecastReturnsInput - The input type for the forecastReturns function.
 * - ForecastReturnsOutput - The return type for the forecastReturns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastSchema = z.object({
  category: z.enum(['electronics', 'clothing', 'home goods', 'toys', 'other']).describe("The product category."),
  forecastedReturns: z.number().describe("The predicted number of returns for this category in the next 7 days."),
  trend: z.enum(['up', 'down', 'stable']).describe("The predicted trend for returns in this category."),
  reasoning: z.string().describe("A brief explanation for the forecast, mentioning any identified patterns."),
});

const ForecastReturnsInputSchema = z.object({
  historicalReturns: z.string().describe('A JSON string of recently returned items over the last 30-60 days, including their name, category, and return reason.'),
});
export type ForecastReturnsInput = z.infer<typeof ForecastReturnsInputSchema>;

const ForecastReturnsOutputSchema = z.object({
  forecasts: z.array(ForecastSchema).describe('An array of return forecasts for each product category for the next 7 days.'),
});
export type ForecastReturnsOutput = z.infer<typeof ForecastReturnsOutputSchema>;

export async function forecastReturns(input: ForecastReturnsInput): Promise<ForecastReturnsOutput> {
  return forecastReturnsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastReturnsPrompt',
  input: {schema: ForecastReturnsInputSchema},
  output: {schema: ForecastReturnsOutputSchema},
  prompt: `You are a data scientist AI specializing in retail analytics and forecasting.
  Your task is to analyze historical return data and predict the volume of returns for each product category for the next 7 days.

  Analyze the following JSON data of historical returned items:
  {{{historicalReturns}}}

  Based on your analysis, provide a forecast for each category. Identify if the trend is likely to be 'up', 'down', or 'stable', and provide a short reasoning for your prediction.
  Consider factors like the volume of recent returns in a category. For example, a high number of electronic returns recently might suggest a continued high trend.
  Return a forecast for every major category, even if the predicted number is low.
  `,
});

const forecastReturnsFlow = ai.defineFlow(
  {
    name: 'forecastReturnsFlow',
    inputSchema: ForecastReturnsInputSchema,
    outputSchema: ForecastReturnsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
