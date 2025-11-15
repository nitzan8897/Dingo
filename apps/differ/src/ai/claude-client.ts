import Anthropic from '@anthropic-ai/sdk';

export class ClaudeClient {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
    this.client = new Anthropic({ apiKey });
  }

  async analyze(prompt: string): Promise<string> {
    // Try to use the model specified in env, or fall back to claude-3-haiku-20240307
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307';

    const completion = await this.client.messages.create({
      model,
      max_tokens: 2000,
      temperature: 0.2,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const textContent = completion.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response');
    }

    return textContent.text;
  }
}
