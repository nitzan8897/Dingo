import { Specialty } from '@dingo/types';
import { CaseAnalysis } from './types';

/**
 * Analyzes a legal case text using AI and extracts structured information
 *
 * @param caseText - The full text of the court judgment
 * @returns Structured analysis of the case
 *
 * TODO: Implement real AI integration with Claude or OpenAI
 * For now, this returns a placeholder. See implementation examples below.
 */
export async function analyzeCaseWithAI(caseText: string): Promise<CaseAnalysis> {
  console.log(`🤖 Analyzing case with AI... (${caseText.length} chars)`);

  // ==================================================================
  // TEMPORARY: Return placeholder until AI is integrated
  // ==================================================================
  console.warn('⚠️  AI analysis not yet implemented. Returning placeholder data.');

  return {
    title: 'Case Analysis Pending',
    specialty: Specialty.CIVIL,
    result: 'other',
    judgeName: undefined,
    openedAt: new Date(),
    closedAt: new Date(),
    complexityScore: 0.5,
    lawyers: [],
  };

  // ==================================================================
  // OPTION 1: ANTHROPIC CLAUDE INTEGRATION
  // ==================================================================
  // Uncomment below to use Anthropic Claude:
  //
  // import Anthropic from '@anthropic-ai/sdk';
  //
  // const client = new Anthropic({
  //   apiKey: process.env.ANTHROPIC_API_KEY!,
  // });
  //
  // const prompt = buildAnalysisPrompt(caseText);
  //
  // const completion = await client.messages.create({
  //   model: 'claude-3-5-sonnet-20241022',
  //   max_tokens: 2000,
  //   messages: [{
  //     role: 'user',
  //     content: prompt
  //   }],
  //   temperature: 0.2, // Low temperature for more consistent JSON output
  // });
  //
  // const responseText = completion.content[0].type === 'text'
  //   ? completion.content[0].text
  //   : '';
  //
  // return parseAIResponse(responseText);

  // ==================================================================
  // OPTION 2: OPENAI GPT INTEGRATION
  // ==================================================================
  // Uncomment below to use OpenAI:
  //
  // import OpenAI from 'openai';
  //
  // const openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY!,
  // });
  //
  // const prompt = buildAnalysisPrompt(caseText);
  //
  // const completion = await openai.chat.completions.create({
  //   model: 'gpt-4-turbo-preview',
  //   messages: [{
  //     role: 'system',
  //     content: 'You are a legal expert analyzing Israeli court judgments. Return ONLY valid JSON.'
  //   }, {
  //     role: 'user',
  //     content: prompt
  //   }],
  //   temperature: 0.2,
  //   response_format: { type: 'json_object' },
  // });
  //
  // const responseText = completion.choices[0]?.message?.content || '{}';
  // return parseAIResponse(responseText);
}

/**
 * Builds the AI prompt for case analysis
 */
function buildAnalysisPrompt(caseText: string): string {
  return `
You are analyzing an Israeli court judgment. Extract the following information and return ONLY a valid JSON object.

REQUIRED JSON STRUCTURE:
{
  "title": "Brief title of the case (e.g., 'Cohen vs. Advanced Construction Ltd.')",
  "specialty": "one of: CRIMINAL, CIVIL, CORPORATE, FAMILY, LABOR, TAX, IMMIGRATION, REAL_ESTATE, INTELLECTUAL_PROPERTY",
  "result": "one of: win, lose, settlement, dismissed, other",
  "judgeName": "Name of the judge (if mentioned)",
  "openedAt": "ISO date string when case was opened",
  "closedAt": "ISO date string when judgment was given",
  "complexityScore": "number between 0 and 1 indicating case complexity",
  "lawyers": [
    {
      "lawyerName": "Full name of lawyer",
      "side": "one of: plaintiff, defendant, other"
    }
  ]
}

CASE TEXT:
${caseText}

Return ONLY the JSON object, no additional text.
`.trim();
}

/**
 * Parses AI response and validates it matches CaseAnalysis structure
 */
function parseAIResponse(responseText: string): CaseAnalysis {
  try {
    const parsed = JSON.parse(responseText);

    // Validate and map specialty
    const specialty = parsed.specialty?.toUpperCase() as Specialty;
    if (!Object.values(Specialty).includes(specialty)) {
      throw new Error(`Invalid specialty: ${parsed.specialty}`);
    }

    // Validate result
    const validResults = ['win', 'lose', 'settlement', 'dismissed', 'other'];
    if (!validResults.includes(parsed.result)) {
      throw new Error(`Invalid result: ${parsed.result}`);
    }

    return {
      title: parsed.title || 'Unknown Case',
      specialty,
      result: parsed.result,
      judgeName: parsed.judgeName,
      openedAt: new Date(parsed.openedAt),
      closedAt: new Date(parsed.closedAt),
      complexityScore: Math.max(0, Math.min(1, parsed.complexityScore || 0.5)),
      lawyers: (parsed.lawyers || []).map((l: any) => ({
        lawyerName: l.lawyerName,
        lawyerId: l.lawyerId,
        side: l.side || 'other',
      })),
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error(`AI response parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
