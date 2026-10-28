import express from 'express';

const router = express.Router();

/**
 * Intelligent contextual template generator for Demo Mode
 */
function generateContextualSuggestions({ customerName, subject, description, category, priority }) {
  const firstName = customerName ? customerName.split(' ')[0] : 'there';
  const cleanSubject = subject ? subject.toLowerCase() : '';
  const cleanDesc = description ? description.toLowerCase() : '';

  let tailoredGuide = '';
  let escalationLevel = 'Tier 2 Engineering';

  if (category === 'Billing') {
    tailoredGuide = `I have reviewed your billing profile and recent invoice statements. I have flagged the transaction for our finance department to issue the necessary credit adjustment or reversal. You should see the adjustment reflected on your statement within 3 to 5 business days.`;
    escalationLevel = 'Finance Operations Team';
  } else if (category === 'Account Access') {
    tailoredGuide = `To verify identity and safely restore account access, I have initiated a secure out-of-band identity challenge. Please check your registered security email or SMS for the one-time verification link. Once approved, MFA can be securely reset.`;
    escalationLevel = 'Identity & Access Security';
  } else if (category === 'Technical') {
    if (cleanSubject.includes('504') || cleanDesc.includes('timeout') || cleanDesc.includes('gateway')) {
      tailoredGuide = `Our systems team investigated the gateway latency. We identified temporary saturation on upstream worker nodes. We have scaled replica sets and flushed pending queue buffers. Could you please retry your request and verify if payloads are passing through cleanly?`;
    } else if (cleanSubject.includes('ssl') || cleanDesc.includes('certificate')) {
      tailoredGuide = `We reviewed your domain DNS zone. The CAA record was preventing Let's Encrypt automated challenge validation. We have adjusted the challenge verification protocol and reissued the wildcard SSL certificate.`;
    } else {
      tailoredGuide = `I reviewed the diagnostic logs for your instance. To resolve this issue, please follow these steps:\n1. Verify service connectivity on port 443.\n2. Invalidate local application cache and retry the request with payload debugging enabled.\n3. Ensure your client SDK is on version 2.4+.\nPlease let us know if the issue persists after these steps.`;
    }
    escalationLevel = 'Senior DevOps & Reliability Team';
  } else if (category === 'Feature Request') {
    tailoredGuide = `Thank you for sharing this valuable feedback! I have logged this specification under Product Request #PR-4192 for our core engineering roadmap review. Our product managers review these submissions every sprint, and I will link your account to notify you when the beta release is available.`;
    escalationLevel = 'Product Engineering Group';
  } else {
    tailoredGuide = `Thank you for contacting SupportFlow. We would be delighted to assist you with this request. Please review the attached documentation link for our standard procedures and tier quotas. If you have specific requirements, please let us know so we can customize our recommendations.`;
    escalationLevel = 'Customer Success Team';
  }

  // Suggestion 1: Quick Acknowledgment & Diagnostic
  const suggestion1 = {
    title: 'Quick Acknowledgment & Clarification',
    description: 'Empathetic response confirming issue receipt and requesting details if needed.',
    tone: 'Courteous & Prompt',
    text: `Hi ${firstName},\n\nThank you for reaching out to SupportFlow regarding "${subject || 'your request'}".\n\nI have received your ticket and am currently reviewing your account details. To help us resolve this as quickly as possible, could you confirm if you are seeing any specific error codes or if this is affecting all users in your organization?\n\nI will keep you updated on progress.\n\nBest regards,\nSupportFlow Customer Care`,
  };

  // Suggestion 2: Actionable Resolution Guide
  const suggestion2 = {
    title: 'Actionable Resolution & Next Steps',
    description: 'Direct solution tailored to the category and issue symptoms.',
    tone: 'Comprehensive & Solutions-Focused',
    text: `Hello ${firstName},\n\nThank you for bringing this to our attention regarding "${subject}".\n\n${tailoredGuide}\n\nIf you need any further assistance or have questions regarding these changes, please reply directly to this ticket.\n\nWarm regards,\nSupportFlow Technical Support`,
  };

  // Suggestion 3: High Priority Escalation Notice
  const suggestion3 = {
    title: 'High Priority Escalation Notice',
    description: 'Formal escalation notice for urgent or complex tickets.',
    tone: 'Formal & Urgent',
    text: `Dear ${firstName},\n\nWe understand the critical nature of this issue regarding "${subject}" and the operational impact on your team.\n\nThis ticket has been marked with ${priority || 'High'} Priority and routed directly to our ${escalationLevel}. A senior specialist is actively investigating and will provide a status update within our dedicated SLA window.\n\nTicket Reference: SupportFlow Dispatch Desk\nDirect SLA Escalation: Active`,
  };

  return [suggestion1, suggestion2, suggestion3];
}

/**
 * POST /api/ai/suggest
 * Body: { customerName, subject, description, category, priority }
 */
router.post('/suggest', async (req, res) => {
  try {
    const { customerName, subject, description, category, priority } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is configured, attempt real AI generation
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const prompt = `You are an expert customer support agent for SupportFlow.
Draft a professional, empathetic, and clear support email response for the following ticket:
Customer Name: ${customerName || 'Customer'}
Category: ${category || 'General'}
Priority: ${priority || 'Medium'}
Subject: ${subject || 'Support Request'}
Description: ${description || 'No description provided'}

Provide 3 distinct options:
Option 1: Quick Acknowledgment & Information Request
Option 2: Comprehensive Resolution & Troubleshooting Guide
Option 3: Escalation and Priority SLA Notice

Return valid JSON format with array "suggestions": [{"title": "...", "description": "...", "tone": "...", "text": "..."}]`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const suggestions = parsed.suggestions || parsed;
            if (Array.isArray(suggestions) && suggestions.length > 0) {
              return res.json({
                success: true,
                mode: 'Live Gemini AI',
                isSimulated: false,
                model: 'gemini-1.5-flash',
                disclaimer: 'Live AI suggestions powered by Google Gemini API.',
                suggestions,
              });
            }
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to transparent demo engine:', geminiError.message);
      }
    }

    // Default & Transparent Demo Mode:
    // Simulate slight natural latency (300ms) for realistic UX
    await new Promise(resolve => setTimeout(resolve, 350));

    const suggestions = generateContextualSuggestions({
      customerName,
      subject,
      description,
      category,
      priority,
    });

    res.json({
      success: true,
      mode: 'Contextual AI Demo Engine',
      isSimulated: true,
      engine: 'Rule-Based Intelligent Heuristics (Capstone Demo Mode)',
      disclaimer: 'Transparent Demo Mode: Generated via intelligent contextual rule-based templates. No external AI API key is configured or charged.',
      notice: 'To connect live Google Gemini AI, simply add GEMINI_API_KEY to your .env file.',
      suggestions,
    });
  } catch (err) {
    console.error('Error in AI suggestion endpoint:', err);
    res.status(500).json({ error: 'Failed to generate response suggestions' });
  }
});

/**
 * POST /api/ai/suggest-priority
 * Transparent rule-based heuristic priority recommendation
 */
router.post('/suggest-priority', (req, res) => {
  try {
    const { subject = '', description = '' } = req.body;
    const combined = `${subject} ${description}`.toLowerCase().trim();

    if (!combined) {
      return res.json({
        success: true,
        suggestedPriority: 'Medium',
        confidence: 'Standard',
        isAiGenerated: false,
        engine: 'Rule-Based Heuristic Engine',
        reason: 'No subject or description provided. Standard Medium priority recommended by default.',
        matchedKeywords: [],
      });
    }

    // High Priority Patterns
    const highKeywords = [
      'payment deducted', 'money deducted', 'deducted', 'charged twice',
      'duplicate charge', 'order not placed', 'billing error', 'unauthorized charge',
      'credit card charged', 'failed transaction', 'money taken', 'refund immediately',
      'cannot access', 'cant access', 'locked out', 'account locked', 'lost access',
      'reset mfa', '2fa reset', 'mfa reset', 'authenticator app', 'security breach',
      'production down', 'system down', 'outage', '504 gateway', '504', '500 error',
      'critical bug', 'data loss', 'database crash', 'emergency', 'urgent', 'asap'
    ];
    const matchedHigh = highKeywords.filter(k => combined.includes(k));
    if (matchedHigh.length > 0) {
      let reason = 'High priority recommended: critical operational disruption, security access lockout, or billing error detected.';
      if (matchedHigh.some(k => k.includes('payment') || k.includes('deducted') || k.includes('charge') || k.includes('order'))) {
        reason = 'Financial discrepancy detected: customer reported payment deduction without order placement or duplicate charge.';
      } else if (matchedHigh.some(k => k.includes('access') || k.includes('locked') || k.includes('mfa') || k.includes('2fa'))) {
        reason = 'Access lockout detected: user or administrator cannot access an important account or authentication system.';
      } else if (matchedHigh.some(k => k.includes('down') || k.includes('outage') || k.includes('504') || k.includes('crash'))) {
        reason = 'Critical service outage or production-breaking technical failure reported.';
      }
      return res.json({
        success: true,
        suggestedPriority: 'High',
        confidence: 'High',
        isAiGenerated: false,
        engine: 'Rule-Based Heuristic Engine',
        reason,
        matchedKeywords: matchedHigh,
      });
    }

    // Low Priority Patterns
    const lowKeywords = [
      'profile update', 'minor profile', 'change profile', 'update name',
      'update phone', 'typo', 'avatar', 'color scheme', 'theme', 'cosmetic',
      'discount', 'educational pricing', 'student discount', 'coupon', 'promo code',
      'general question', 'general feedback'
    ];
    const matchedLow = lowKeywords.filter(k => combined.includes(k));
    if (matchedLow.length > 0) {
      let reason = 'Low priority recommended: minor administrative request or general inquiry without operational disruption.';
      if (matchedLow.some(k => k.includes('profile') || k.includes('avatar') || k.includes('theme') || k.includes('typo'))) {
        reason = 'Minor profile update or cosmetic request without operational disruption.';
      } else if (matchedLow.some(k => k.includes('discount') || k.includes('educational') || k.includes('student'))) {
        reason = 'General sales or educational discount inquiry.';
      }
      return res.json({
        success: true,
        suggestedPriority: 'Low',
        confidence: 'High',
        isAiGenerated: false,
        engine: 'Rule-Based Heuristic Engine',
        reason,
        matchedKeywords: matchedLow,
      });
    }

    // Medium Priority Patterns
    const mediumKeywords = [
      'feature question', 'general feature', 'how do i', 'how to', 'bulk export',
      'csv export', 'api rate limit', 'rate limit', 'webhook', 'documentation',
      'integration guide', 'export data'
    ];
    const matchedMed = mediumKeywords.filter(k => combined.includes(k));
    if (matchedMed.length > 0) {
      return res.json({
        success: true,
        suggestedPriority: 'Medium',
        confidence: 'High',
        isAiGenerated: false,
        engine: 'Rule-Based Heuristic Engine',
        reason: 'Standard product workflow: general feature inquiry or non-blocking technical consultation.',
        matchedKeywords: matchedMed,
      });
    }

    // Default
    return res.json({
      success: true,
      suggestedPriority: 'Medium',
      confidence: 'Standard',
      isAiGenerated: false,
      engine: 'Rule-Based Heuristic Engine',
      reason: 'Standard support intake: no critical urgency or low-priority triggers identified.',
      matchedKeywords: [],
    });
  } catch (err) {
    console.error('Error in priority suggestion endpoint:', err);
    res.status(500).json({ success: false, error: 'Failed to analyze priority' });
  }
});

export default router;
