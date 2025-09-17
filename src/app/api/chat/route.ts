import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client only when needed to avoid build-time errors
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not configured');
  }
  
  return new OpenAI({
    apiKey: apiKey,
  });
}

const SYSTEM_PROMPT = `You are VentaroAI's helpful assistant. You specialize in custom web development services. Here's key information about VentaroAI:

**Services & Pricing:**
- Custom websites: $500-$3,000+ (vs traditional agencies: $5,000-$15,000+)
- E-commerce solutions, landing pages, AI integration
- SEO optimization, mobile responsive design
- Content management systems, digital marketing tools
- DIY resources starting at $50

**21-Day Delivery Guarantee:**
1. Free quote & design discussion
2. 50% deposit to start project
3. Complete website delivered in 21 days
4. Pay remaining 50% upon completion
5. If delayed beyond 21 days, client keeps the deposit!

**Technology:**
- React, Next.js, TypeScript, Tailwind CSS
- AI-powered development tools
- Complete source code ownership
- Host anywhere (no vendor lock-in)
- No monthly fees

**Key Benefits:**
- 80% cost savings vs agencies
- 21-day delivery vs 2-6 months
- Complete source code ownership
- 50% deposit protection
- Unlimited customization
- Freedom and flexibility

**Contact:**
- For issues or detailed questions: chris.t@ventarosales.com
- Quote form available on website

Respond naturally and conversationally. Be helpful, enthusiastic, and professional. Keep responses concise but informative. Always end with encouraging the user to get a free quote or contact Chris for specific needs.`

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    // Get OpenAI client (will throw error if API key not configured)
    let openai;
    try {
      openai = getOpenAIClient();
    } catch (error) {
      console.error('OpenAI API key not configured:', error);
      return NextResponse.json(
        { 
          response: "I'm currently experiencing technical difficulties. For immediate assistance, please contact Chris at chris.t@ventarosales.com or fill out our quote form. We offer custom websites from $500-$3,000+ with a 21-day delivery guarantee!" 
        },
        { status: 200 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 
      "I'd be happy to help! Ask me about our pricing, 21-day delivery guarantee, or any other questions about VentaroAI's services."

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { 
        response: "I'm having trouble connecting right now. For immediate assistance, please contact Chris at chris.t@ventarosales.com or use our quote form. We offer custom websites from $500-$3,000+ with complete source code ownership!" 
      },
      { status: 200 }
    )
  }
}