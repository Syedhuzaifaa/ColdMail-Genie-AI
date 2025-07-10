
interface GenerateMessageParams {
  niche: string;
  platform: string;
  offer: string;
  clientName?: string;
}

interface GeneratedMessage {
  content: string;
  tone: string;
}

// Platform-specific tone mapping
const platformTones = {
  linkedin: 'Professional',
  email: 'Formal',
  upwork: 'Professional',
  instagram: 'Casual'
};

// Enhanced AI message generation with Gemini API
export async function generateMessages({ 
  niche, 
  platform, 
  offer, 
  clientName 
}: GenerateMessageParams): Promise<GeneratedMessage[]> {
  
  // Try Gemini API first, fallback to mock
  try {
    return await generateMessagesWithGemini({ niche, platform, offer, clientName });
  } catch (error) {
    console.log('Gemini API failed, using fallback:', error);
    return await generateMockMessages({ niche, platform, offer, clientName });
  }
}

// Gemini AI Integration
export async function generateMessagesWithGemini({ 
  niche, 
  platform, 
  offer, 
  clientName 
}: GenerateMessageParams): Promise<GeneratedMessage[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
  }
  
  const tone = platformTones[platform as keyof typeof platformTones] || 'Professional';
  const clientNameText = clientName ? `The client's name is ${clientName}.` : 'Use a generic greeting.';
  
  const prompt = `You are an expert copywriter specializing in cold outreach. Generate 3 different ${tone.toLowerCase()} outreach messages for ${platform} targeting someone in the ${niche} niche.

${clientNameText}

The offer is: ${offer}

Requirements:
- Each message should have a different approach: Direct, Value-First, and Question-Based
- Keep messages concise and action-oriented (150-250 words max)
- Include appropriate ${platform} etiquette and tone
- Make them feel personal, not templated
- Include a clear call-to-action
- Use emojis sparingly and appropriately for ${platform}

Return ONLY a JSON array with this exact format:
[
  {"content": "message 1 text", "tone": "${tone} - Direct"},
  {"content": "message 2 text", "tone": "${tone} - Value-First"}, 
  {"content": "message 3 text", "tone": "${tone} - Question-Based"}
]`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const messages = JSON.parse(jsonMatch[0]);
      return messages;
    }
    
    throw new Error('Could not parse Gemini response');
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

// Enhanced mock generation as fallback
async function generateMockMessages({ 
  niche, 
  platform, 
  offer, 
  clientName 
}: GenerateMessageParams): Promise<GeneratedMessage[]> {
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const tone = platformTones[platform as keyof typeof platformTones] || 'Professional';
  const greeting = clientName ? `Hi ${clientName}` : getGenericGreeting(platform);
  
  const messages: GeneratedMessage[] = [];
  
  // Generate 3 different variations with enhanced creativity
  const templates = getEnhancedMessageTemplates(platform, niche, offer, greeting);
  
  templates.forEach((template, index) => {
    const toneVariants = [`${tone} - Direct`, `${tone} - Value-First`, `${tone} - Question-Based`];
    messages.push({
      content: template,
      tone: toneVariants[index] || tone
    });
  });
  
  return messages;
}

function getGenericGreeting(platform: string): string {
  const greetings = {
    linkedin: ['Hi there', 'Hello', 'Hey'],
    email: ['Hello', 'Hi', 'Good day'],
    upwork: ['Hello', 'Hi there', 'Greetings'],
    instagram: ['Hey', 'Hi', 'Hello']
  };
  
  const platformGreetings = greetings[platform as keyof typeof greetings] || greetings.email;
  return platformGreetings[Math.floor(Math.random() * platformGreetings.length)];
}

function getEnhancedMessageTemplates(platform: string, niche: string, offer: string, greeting: string): string[] {
  const templates = [];
  
  switch (platform) {
    case 'linkedin':
      templates.push(
        // Direct approach
        `${greeting}! 👋

I specialize in ${niche.toLowerCase()} and noticed your impressive work in the industry.

${offer}

I'd love to discuss how this could specifically benefit your business. Are you available for a quick 15-minute call this week?

Best regards`,

        // Value-first approach
        `${greeting}!

Quick insight: Most businesses in ${niche.toLowerCase()} are missing out on 40% more leads due to outdated strategies.

${offer}

I've helped 20+ similar companies achieve breakthrough results. Would you be interested in a free 10-minute strategy session?

Looking forward to connecting!`,

        // Question-based approach
        `${greeting}!

Question: What's your biggest challenge in ${niche.toLowerCase()} right now?

${offer}

I'm curious about your current approach and whether there's an opportunity to collaborate. Mind if I ask what's working best for you currently?

Cheers!`
      );
      break;
      
    case 'email':
      templates.push(
        // Direct approach
        `Subject: ${niche} Growth Opportunity - 15 Min Chat?

${greeting},

I hope this email finds you well. I specialize in helping businesses like yours excel in ${niche.toLowerCase()}.

${offer}

Based on my experience with similar companies, I believe this could be particularly valuable for your business. Would you be open to a brief conversation?

Best regards`,

        // Value-first approach  
        `Subject: Free ${niche} Audit Results Inside

${greeting},

I've been researching companies in your space and found some interesting opportunities for improvement.

${offer}

I'd like to share a few quick wins that could impact your bottom line immediately. No strings attached - just good insights.

Would you be interested in a 10-minute call?`,

        // Question-based approach
        `Subject: Quick Question About Your ${niche} Strategy

${greeting},

I'm reaching out because I'm genuinely curious about your current ${niche.toLowerCase()} approach.

${offer}

What's been your biggest win in this area lately? And what's the one thing you'd change if you could?

I'd love to exchange insights.`
      );
      break;
      
    case 'upwork':
      templates.push(
        // Direct approach
        `${greeting}!

Perfect match! Your ${niche.toLowerCase()} project aligns exactly with my expertise.

${offer}

✅ 5+ years ${niche.toLowerCase()} experience
✅ 98% client satisfaction rate  
✅ Fast turnaround guaranteed
✅ Clear communication throughout

Ready to start immediately. When can we discuss your vision?`,

        // Value-first approach
        `${greeting}!

I love your project! Here's what I'd bring to your ${niche.toLowerCase()} needs:

${offer}

FREE BONUS: I'll include a comprehensive project audit and optimization recommendations at no extra cost.

My approach: Understand → Strategize → Execute → Exceed expectations

Interested in discussing how we can make this project exceptional?`,

        // Question-based approach
        `${greeting}!

Your ${niche.toLowerCase()} project caught my attention. Quick questions:

1. What's your biggest concern with this project?
2. What would success look like to you?

${offer}

I believe in understanding your vision completely before proposing solutions. Mind sharing your thoughts on these?`
      );
      break;
      
    case 'instagram':
      templates.push(
        // Direct approach
        `${greeting}! 🌟

Your ${niche.toLowerCase()} content is fire! 🔥

${offer}

Think we could create something amazing together! 

DM me if you're interested! ✨`,

        // Value-first approach
        `${greeting}! ✨

Been following your ${niche.toLowerCase()} journey - you're crushing it! 📈

${offer}

Here's a free tip: Try [specific strategy] - saw 200% growth with similar accounts! 🚀

Want more insights? Let's connect! 💫`,

        // Question-based approach
        `${greeting}! 👋

Love your ${niche.toLowerCase()} content! Quick question:

What's your dream project you haven't tackled yet? 🤔

${offer}

Maybe we can make that dream project happen together? 🌟

Drop me a DM! 📩`
      );
      break;
  }
  
  return templates;
}
