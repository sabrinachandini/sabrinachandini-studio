import type { ModerationResult, ModerationLabel } from '@/types/content';

// Spam indicators
const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|lottery|winner|prize|free money)\b/i,
  /\b(click here|buy now|limited time|act now)\b/i,
  /\b(earn \$|make \$|make money fast)\b/i,
  /https?:\/\/[^\s]+/gi, // URLs (count them)
];

const TOXIC_PATTERNS = [
  /\b(idiot|stupid|moron|dumb|loser)\b/i,
  /\b(hate you|kill|die)\b/i,
];

const PROMO_PATTERNS = [
  /\b(check out my|visit my|follow me|subscribe)\b/i,
  /\b(my website|my blog|my channel)\b/i,
  /\b(discount|coupon|promo code)\b/i,
];

/**
 * AI-assisted moderation using OpenAI API if available,
 * otherwise falls back to heuristic rules.
 */
export async function moderateMessage(message: string): Promise<ModerationResult> {
  // Try AI moderation if API key is available
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      return await moderateWithAI(message, openaiKey);
    } catch (error) {
      console.error('AI moderation failed, falling back to heuristics:', error);
    }
  }

  // Fall back to heuristic rules
  return moderateWithHeuristics(message);
}

async function moderateWithAI(message: string, apiKey: string): Promise<ModerationResult> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a content moderation assistant. Analyze the following guestbook message and classify it.

Return a JSON object with:
- label: one of "ok", "spam", "promo", "toxic", or "unknown"
- score: confidence from 0 to 1 (1 = very confident)
- reasons: array of brief reasons for your classification

Be lenient with friendly messages. Flag obvious spam, self-promotion, or toxic content.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 150,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content);

  return {
    label: validateLabel(result.label),
    score: Math.min(1, Math.max(0, result.score || 0.5)),
    reasons: result.reasons || [],
  };
}

function validateLabel(label: string): ModerationLabel {
  const validLabels: ModerationLabel[] = ['ok', 'spam', 'promo', 'toxic', 'unknown'];
  return validLabels.includes(label as ModerationLabel) ? (label as ModerationLabel) : 'unknown';
}

function moderateWithHeuristics(message: string): ModerationResult {
  const reasons: string[] = [];
  let label: ModerationLabel = 'ok';
  let score = 0.7; // Default confidence for heuristics

  // Count URLs
  const urls = message.match(/https?:\/\/[^\s]+/gi) || [];
  if (urls.length > 2) {
    reasons.push(`Contains ${urls.length} URLs`);
    label = 'spam';
    score = 0.8;
  }

  // Check for spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(message)) {
      reasons.push('Contains spam keywords');
      label = 'spam';
      score = 0.9;
      break;
    }
  }

  // Check for toxic patterns
  for (const pattern of TOXIC_PATTERNS) {
    if (pattern.test(message)) {
      reasons.push('Contains potentially toxic language');
      label = 'toxic';
      score = 0.8;
      break;
    }
  }

  // Check for promo patterns
  if (label === 'ok') {
    for (const pattern of PROMO_PATTERNS) {
      if (pattern.test(message)) {
        reasons.push('Contains self-promotion');
        label = 'promo';
        score = 0.7;
        break;
      }
    }
  }

  // Check for repeated characters (like "aaaaaaa" or "!!!!!!!")
  if (/(.)\1{4,}/.test(message)) {
    reasons.push('Contains repeated characters');
    if (label === 'ok') {
      label = 'unknown';
      score = 0.5;
    }
  }

  // Very short messages are suspicious but not necessarily bad
  if (message.length < 10) {
    reasons.push('Very short message');
    if (label === 'ok') {
      label = 'unknown';
      score = 0.6;
    }
  }

  // All caps is sometimes suspicious
  if (message.length > 20 && message === message.toUpperCase()) {
    reasons.push('All caps message');
    if (label === 'ok') {
      label = 'unknown';
      score = 0.6;
    }
  }

  // If nothing flagged, it's probably ok
  if (reasons.length === 0) {
    reasons.push('No issues detected');
    score = 0.9;
  }

  return { label, score, reasons };
}
