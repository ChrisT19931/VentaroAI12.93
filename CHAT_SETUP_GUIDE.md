# AI Chat Widget Setup Guide

## Overview
The VentaroAI website includes an AI-powered chat widget that helps visitors with questions about services, pricing, and more.

## Required Setup

### 1. OpenAI API Key
The chat widget requires an OpenAI API key to function properly.

**Get your API key:**
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Generate a new API key
4. Copy the key (starts with `sk-`)

### 2. Vercel Environment Variable
Add the API key to your Vercel deployment:

**Option A: Vercel Dashboard**
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add new variable:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key
   - **Environment:** Production (and Preview if needed)
4. Redeploy your application

**Option B: Vercel CLI**
```bash
vercel env add OPENAI_API_KEY
# Enter your API key when prompted
vercel --prod
```

### 3. Local Development
For local development, add to your `.env.local` file:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## Features
Once configured, the chat widget provides:
- 24/7 automated customer support
- Information about VentaroAI services and pricing
- Lead qualification and routing
- Professional, context-aware responses

## Troubleshooting
- **Chat not responding:** Check if OPENAI_API_KEY is set in Vercel
- **API errors:** Verify your OpenAI account has sufficient credits
- **Local issues:** Ensure `.env.local` contains the API key

## Cost Considerations
- OpenAI charges per token used
- Typical conversation costs $0.01-0.05
- Monitor usage in OpenAI dashboard
- Set usage limits if needed