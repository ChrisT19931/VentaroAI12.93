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

const SYSTEM_PROMPT = `You are VentaroAI's helpful AI assistant. You are an expert on all Ventaro AI services, products, and offerings. Here's comprehensive information about VentaroAI:

**COMPANY OVERVIEW:**
- Founded: March 2025 in Melbourne, Australia
- Mission: Bridge traditional business practices with cutting-edge AI technology
- Goal: Empower individuals and businesses to thrive in the AI revolution

**PRIMARY SERVICES:**

**1. VAI COACHING (#1 FLAGSHIP OFFER):**
- VAI Beginners Mastery: $250 (60-min consultation + 1 month email support)
- VAI Web Development Elite: $500+ (Advanced AI web development training)
- Personalized 1-on-1 AI coaching for all skill levels
- Complete AI fundamentals training and business applications
- Practical project guidance and implementation support

**2. VAI TOOLKIT - Digital Products:**
- AI Tools Mastery Guide 2025: $25 (30-page comprehensive guide)
- AI Prompts Arsenal 2025: $10 (30 professional AI prompts)
- AI Web Creation Masterclass: $50 (2-hour video training)
- AI Resources & Guides: $50 each (Business AI, Beginners Systems, AI Business Build)

**3. PRICING PLANS:**
- VAI Toolkit All-in-One: $197 (was $497) - Most Popular
- AI Business Blueprint 2025: $97 (was $297) - Flagship
- Weekly Support Contract: $197/month (was $297) - Premium
- Enterprise Solutions: Custom pricing

**4. COMING SOON:**
- AI Masterclass (Advanced certification program)
- Web Generation Services (AI-powered web development)

**AI TOOLS COVERED:**
- ChatGPT 4.0: Advanced reasoning, code generation, content creation
- Claude 3.5 Sonnet: Superior analytics, ethical AI, business strategy
- Google Gemini Pro: Real-time data, multimodal capabilities, analytics
- Grok: Real-time insights, Twitter integration, trend analysis
- Midjourney: AI image generation and creative design
- Runway ML: AI video creation and editing

**REVENUE OPPORTUNITIES WE TEACH:**
- Content Creation: $50-200/article, $100-500/project
- Business Services: $500-2000/plan, $150-300/hour consulting
- E-commerce Solutions: $25-300/product descriptions
- Advanced Services: $1000-50000 for AI tools and SaaS development
- Customer Service: $1000-5000/chatbot project
- Data Analysis: $100-250/hour, $500-1500/report

**TARGET AUDIENCES:**
- AI Beginners seeking foundational knowledge
- Business owners wanting AI integration
- Entrepreneurs building AI-powered businesses
- Developers needing advanced AI implementation
- Enterprises requiring custom AI solutions

**KEY VALUE PROPOSITIONS:**
- Proven expertise with real-world implementation
- Comprehensive end-to-end AI solutions
- Practical step-by-step guidance
- Personalized 1-on-1 coaching available
- Private community and weekly group calls
- All skill levels from beginner to advanced

**CONTACT & SUPPORT:**
- Primary Contact: chris.t@ventarosales.com
- Available globally (remote services)
- Email support included with all products
- Community access with premium plans

**IMPLEMENTATION PROCESS:**
1. Assessment: Current state analysis and goal identification
2. Planning: Custom roadmap and tool selection
3. Implementation: Step-by-step execution and training
4. Support: Ongoing monitoring and optimization

Respond naturally and conversationally. Be helpful, enthusiastic, and professional. Focus on how AI can transform their business. Always encourage users to start with our #1 offer (VAI Coaching) or explore our toolkit. For specific needs, direct them to contact Chris at chris.t@ventarosales.com.`

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
          response: "I'm currently experiencing technical difficulties. For immediate assistance, please contact Chris at chris.t@ventarosales.com. We offer AI coaching services, digital products, and comprehensive AI business solutions to transform your business!" 
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
      "I'd be happy to help! Ask me about our AI coaching services, digital products, pricing plans, or how AI can transform your business."

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { 
        response: "I'm having trouble connecting right now. For immediate assistance, please contact Chris at chris.t@ventarosales.com. We offer AI coaching services, digital products, and comprehensive business transformation solutions!" 
      },
      { status: 200 }
    )
  }
}