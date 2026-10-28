/**
 * Smart Priority Suggestion Engine (Transparent Rule-Based Heuristic Analysis)
 * 
 * Accurately analyzes subject and description text to recommend Low, Medium, or High priority
 * without pretending to call an external AI service.
 */

export function analyzePrioritySuggestion(subject = '', description = '') {
  const combined = `${subject || ''} ${description || ''}`.toLowerCase().trim();

  if (!combined) {
    return {
      suggestedPriority: 'Medium',
      confidence: 'Standard',
      isAiGenerated: false,
      engine: 'Rule-Based Heuristic Engine',
      reason: 'No subject or description entered. Standard Medium priority suggested by default.',
      matchedKeywords: [],
    };
  }

  // 1. HIGH PRIORITY PATTERNS
  const highPatterns = [
    {
      keywords: [
        'payment deducted', 'money deducted', 'deducted', 'charged twice',
        'duplicate charge', 'order not placed', 'billing error', 'unauthorized charge',
        'credit card charged', 'failed transaction', 'money taken', 'refund immediately'
      ],
      reason: 'Financial discrepancy: customer reported money/payment deducted without order placement or duplicate charge.',
    },
    {
      keywords: [
        'cannot access', 'cant access', 'locked out', 'account locked', 'lost access',
        'reset mfa', '2fa reset', 'mfa reset', 'authenticator app', 'security breach',
        'unauthorized access', 'account hacked', 'admin credentials'
      ],
      reason: 'Access lockout: user or administrator cannot access an important account or authentication system.',
    },
    {
      keywords: [
        'production down', 'system down', 'outage', '504 gateway', '504', '500 error',
        'critical bug', 'data loss', 'database crash', 'service down', 'broken in prod'
      ],
      reason: 'Critical service outage or production-breaking technical failure reported.',
    },
    {
      keywords: ['emergency', 'urgent', 'asap', 'high priority', 'blocking launch', 'revenue impact'],
      reason: 'Urgent operational escalation keywords detected in problem description.',
    }
  ];

  for (const pattern of highPatterns) {
    const matched = pattern.keywords.filter(k => combined.includes(k));
    if (matched.length > 0) {
      return {
        suggestedPriority: 'High',
        confidence: 'High',
        isAiGenerated: false,
        engine: 'Rule-Based Heuristic Engine',
        reason: pattern.reason,
        matchedKeywords: matched,
      };
    }
  }

  // 2. LOW PRIORITY PATTERNS
  const lowPatterns = [
    {
      keywords: [
        'profile update', 'minor profile', 'change profile', 'update name',
        'update phone', 'typo', 'avatar', 'color scheme', 'theme', 'cosmetic',
        'font size', 'dark mode request'
      ],
      reason: 'Minor administrative request: routine profile update or cosmetic preference without workflow impact.',
    },
    {
      keywords: [
        'discount', 'educational pricing', 'student discount', 'coupon', 'promo code',
        'pricing inquiry', 'subscription quote'
      ],
      reason: 'General pricing or educational discount inquiry.',
    },
    {
      keywords: ['general question', 'general feedback', 'feedback', 'minor question', 'just wondering'],
      reason: 'Routine general feedback or informational query without time sensitivity.',
    }
  ];

  for (const pattern of lowPatterns) {
    const matched = pattern.keywords.filter(k => combined.includes(k));
    if (matched.length > 0) {
      return {
        suggestedPriority: 'Low',
        confidence: 'High',
        isAiGenerated: false,
        engine: 'Rule-Based Heuristic Engine',
        reason: pattern.reason,
        matchedKeywords: matched,
      };
    }
  }

  // 3. MEDIUM PRIORITY PATTERNS
  const mediumPatterns = [
    {
      keywords: [
        'feature question', 'general feature', 'how do i', 'how to', 'bulk export',
        'csv export', 'api rate limit', 'rate limit', 'webhook', 'documentation',
        'integration guide', 'export data', 'sso configuration', 'ssl renewal'
      ],
      reason: 'Standard workflow request: general feature inquiry or non-blocking technical consultation.',
    }
  ];

  for (const pattern of mediumPatterns) {
    const matched = pattern.keywords.filter(k => combined.includes(k));
    if (matched.length > 0) {
      return {
        suggestedPriority: 'Medium',
        confidence: 'High',
        isAiGenerated: false,
        engine: 'Rule-Based Heuristic Engine',
        reason: pattern.reason,
        matchedKeywords: matched,
      };
    }
  }

  // Default Standard Recommendation
  return {
    suggestedPriority: 'Medium',
    confidence: 'Standard',
    isAiGenerated: false,
    engine: 'Rule-Based Heuristic Engine',
    reason: 'Standard support intake: no critical urgency or low-priority triggers identified.',
    matchedKeywords: [],
  };
}
