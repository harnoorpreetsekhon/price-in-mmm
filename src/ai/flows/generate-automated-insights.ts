'use server';

/**
 * @fileOverview Generates automated insights from the marketing mix model dashboard using GenAI.
 *
 * - generateAutomatedInsights - A function that generates insights from the MMM dashboard data.
 * - GenerateAutomatedInsightsInput - The input type for the generateAutomatedInsights function.
 * - GenerateAutomatedInsightsOutput - The return type for the generateAutomatedInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAutomatedInsightsInputSchema = z.object({
  dashboardData: z.string().describe('The marketing mix model dashboard data as a JSON string.'),
});
export type GenerateAutomatedInsightsInput = z.infer<typeof GenerateAutomatedInsightsInputSchema>;

const GenerateAutomatedInsightsOutputSchema = z.object({
  insights: z.string().describe('The generated insights from the MMM dashboard data.'),
});
export type GenerateAutomatedInsightsOutput = z.infer<typeof GenerateAutomatedInsightsOutputSchema>;

export async function generateAutomatedInsights(input: GenerateAutomatedInsightsInput): Promise<GenerateAutomatedInsightsOutput> {
  return generateAutomatedInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAutomatedInsightsPrompt',
  input: {schema: GenerateAutomatedInsightsInputSchema},
  output: {schema: GenerateAutomatedInsightsOutputSchema},
  prompt: `You are an expert marketing analyst. Analyze the following marketing mix model dashboard data and generate key insights.

Dashboard Data: {{{dashboardData}}}

Provide a concise summary of the key trends and actionable recommendations based on the data. Focus on optimizing marketing strategies.
`,
});

const generateAutomatedInsightsFlow = ai.defineFlow(
  {
    name: 'generateAutomatedInsightsFlow',
    inputSchema: GenerateAutomatedInsightsInputSchema,
    outputSchema: GenerateAutomatedInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
