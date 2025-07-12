// src/ai/flows/recommend-returned-item-action.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for recommending actions for returned items.
 *
 * - recommendReturnedItemAction - A function that recommends actions for returned items.
 * - RecommendReturnedItemActionInput - The input type for the recommendReturnedItemAction function.
 * - RecommendReturnedItemActionOutput - The return type for the recommendReturnedItemAction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendReturnedItemActionInputSchema = z.object({
  itemDescription: z.string().describe('A description of the returned item.'),
  itemCondition: z.string().describe('The condition of the returned item (e.g., new, used, damaged).'),
  itemCategory: z.string().describe('The category of the returned item (e.g., electronics, clothing, home goods).'),
  returnReason: z.string().describe('The reason for the return.'),
});

export type RecommendReturnedItemActionInput = z.infer<typeof RecommendReturnedItemActionInputSchema>;

const RecommendReturnedItemActionOutputSchema = z.object({
  recommendedAction: z.enum(['reuse', 'repair', 'recycle', 'resell']).describe('The recommended action for the returned item.'),
  reasoning: z.string().describe('The reasoning behind the recommended action.'),
});

export type RecommendReturnedItemActionOutput = z.infer<typeof RecommendReturnedItemActionOutputSchema>;

export async function recommendReturnedItemAction(input: RecommendReturnedItemActionInput): Promise<RecommendReturnedItemActionOutput> {
  return recommendReturnedItemActionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendReturnedItemActionPrompt',
  input: {schema: RecommendReturnedItemActionInputSchema},
  output: {schema: RecommendReturnedItemActionOutputSchema},
  prompt: `You are an expert in reverse logistics and sustainability.

  Based on the following information about a returned item, recommend the most appropriate action to minimize waste and maximize sustainability. You must pick one of the following actions: reuse, repair, recycle, resell.

  Item Description: {{{itemDescription}}}
  Item Condition: {{{itemCondition}}}
  Item Category: {{{itemCategory}}}
  Return Reason: {{{returnReason}}}

  Explain your reasoning for the recommended action in the reasoning field.
  `,
});

const recommendReturnedItemActionFlow = ai.defineFlow(
  {
    name: 'recommendReturnedItemActionFlow',
    inputSchema: RecommendReturnedItemActionInputSchema,
    outputSchema: RecommendReturnedItemActionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
