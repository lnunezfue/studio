'use server';
/**
 * @fileOverview Provides preliminary medical guidance via a chat interface.
 *
 * - medicalGuidanceChat - A function that provides basic health information.
 * - MedicalGuidanceChatInput - The input type for the medicalGuidanceChat function.
 * - MedicalGuidanceChatOutput - The return type for the medicalGuidanceChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicalGuidanceChatInputSchema = z.object({
  userInput: z.string().describe('The user input query for medical guidance.'),
  pastMessages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The past messages in the conversation.'),
});
export type MedicalGuidanceChatInput = z.infer<typeof MedicalGuidanceChatInputSchema>;

const MedicalGuidanceChatOutputSchema = z.object({
  response: z.string().describe('The AI response providing medical guidance.'),
});
export type MedicalGuidanceChatOutput = z.infer<typeof MedicalGuidanceChatOutputSchema>;

export async function medicalGuidanceChat(input: MedicalGuidanceChatInput): Promise<MedicalGuidanceChatOutput> {
  return medicalGuidanceChatFlow(input);
}

const medicalGuidanceChatPrompt = ai.definePrompt({
  name: 'medicalGuidanceChatPrompt',
  input: {schema: MedicalGuidanceChatInputSchema},
  output: {schema: MedicalGuidanceChatOutputSchema},
  prompt: `You are a helpful AI assistant providing preliminary medical guidance.  Provide basic health information based on the user's query and suggest if they should book a telemedicine appointment. Do not provide diagnosis or treatment plans. If the user asks a question outside of your scope, gently redirect them to consult with a healthcare professional. Incorporate relevant past messages to maintain context.

Past Messages:
{{#each pastMessages}}
  {{this.role}}: {{this.content}}
{{/each}}

User Input: {{{userInput}}}`, 
});

const medicalGuidanceChatFlow = ai.defineFlow(
  {
    name: 'medicalGuidanceChatFlow',
    inputSchema: MedicalGuidanceChatInputSchema,
    outputSchema: MedicalGuidanceChatOutputSchema,
  },
  async input => {
    const {output} = await medicalGuidanceChatPrompt(input);
    return output!;
  }
);
