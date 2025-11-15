export function buildAnalysisPrompt(caseText: string): string {
  return `You are analyzing an Israeli court judgment. Extract the following information and return ONLY a valid JSON object.

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

Return ONLY the JSON object, no additional text.`;
}
