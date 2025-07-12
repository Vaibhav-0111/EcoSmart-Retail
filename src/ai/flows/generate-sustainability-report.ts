// src/ai/flows/generate-sustainability-report.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a sustainability report.
 *
 * - generateSustainabilityReport - A function that takes sustainability data and generates a report.
 * - GenerateSustainabilityReportInput - The input type for the generateSustainabilityReport function.
 * - GenerateSustainabilityReportOutput - The return type for the generateSustainabilityReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSustainabilityReportInputSchema = z.object({
  co2Saved: z.string().describe('Total CO2 emissions saved in kg.'),
  wasteDiverted: z.string().describe('Total waste diverted from landfill in kg.'),
  waterSaved: z.string().describe('Total water saved in liters.'),
  treesSaved: z.string().describe('Equivalent number of trees saved.'),
  actionBreakdown: z.any().describe('An object showing the count of items for each action (resell, repair, etc.).')
});

export type GenerateSustainabilityReportInput = z.infer<typeof GenerateSustainabilityReportInputSchema>;

const GenerateSustainabilityReportOutputSchema = z.object({
  report: z.string().describe('A comprehensive, narrative-style sustainability report in Markdown format.'),
});

export type GenerateSustainabilityReportOutput = z.infer<typeof GenerateSustainabilityReportOutputSchema>;

export async function generateSustainabilityReport(input: GenerateSustainabilityReportInput): Promise<GenerateSustainabilityReportOutput> {
  return generateSustainabilityReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSustainabilityReportPrompt',
  input: {schema: GenerateSustainabilityReportInputSchema},
  output: {schema: GenerateSustainabilityReportOutputSchema},
  prompt: `You are an expert sustainability analyst for a major retail company.
  Your task is to generate a compelling, positive, and data-driven sustainability report based on the provided metrics.
  The report should be in Markdown format and be suitable for sharing with stakeholders.

  Use the following data:
  - CO2 Emissions Saved: {{{co2Saved}}}
  - Waste Diverted from Landfill: {{{wasteDiverted}}}
  - Water Saved: {{{waterSaved}}}
  - Trees Saved: {{{treesSaved}}}
  - Action Breakdown: {{{JSONstringify actionBreakdown}}}

  Structure your report with the following sections:
  1.  A powerful opening statement summarizing the overall positive impact.
  2.  A "Key Achievements" section with bullet points highlighting the main metrics.
  3.  A "Breakdown of Actions" section that explains how different actions (like reselling, recycling) contributed to these results.
  4.  A concluding paragraph that reinforces the company's commitment to sustainability and future goals.

  Make the tone professional, encouraging, and impactful.
  `,
});

const generateSustainabilityReportFlow = ai.defineFlow(
  {
    name: 'generateSustainabilityReportFlow',
    inputSchema: GenerateSustainabilityReportInputSchema,
    outputSchema: GenerateSustainabilityReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
