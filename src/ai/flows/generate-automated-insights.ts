'use server';

/**
 * @fileOverview Generates a decision cockpit with recommendations from the marketing mix model dashboard using GenAI.
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
  recommendations: z.array(z.string()).describe("A list of 3-5 concrete, actionable recommendations based on the data analysis. Each recommendation should be a clear, concise sentence."),
  expectedUplift: z.string().describe("An estimated overall profit uplift if the recommendations are implemented, expressed as a percentage range (e.g., '3-5%')."),
  assumptions: z.array(z.string()).describe("A list of the key assumptions the model made to generate the recommendations (e.g., 'market conditions remain stable')."),
  risks: z.array(z.string()).describe("A list of potential risks or limitations associated with the recommendations (e.g., 'competitor reactions are not modeled')."),
});
export type GenerateAutomatedInsightsOutput = z.infer<typeof GenerateAutomatedInsightsOutputSchema>;

export async function generateAutomatedInsights(input: GenerateAutomatedInsightsInput): Promise<GenerateAutomatedInsightsOutput> {
  return generateAutomatedInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAutomatedInsightsPrompt',
  input: {schema: GenerateAutomatedInsightsInputSchema},
  output: {schema: GenerateAutomatedInsightsOutputSchema},
  prompt: `You are an expert marketing analyst tasked with creating a "Decision Cockpit".
Analyze the following marketing mix model dashboard data and generate a summary of recommended actions, expected profit uplift, key assumptions, and potential risks.

Dashboard Data: {{{dashboardData}}}

Based on your analysis, provide the following in the structured output format:
1.  **recommendations**: A list of 3-5 concrete, actionable recommendations.
2.  **expectedUplift**: An estimated profit uplift range if the recommendations are followed.
3.  **assumptions**: The key assumptions underpinning your analysis.
4.  **risks**: The potential risks or external factors that could impact the outcome.
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
