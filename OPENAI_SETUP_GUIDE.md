# OpenAI API Key Setup Guide

## Overview

This guide explains how to properly configure the OpenAI API key for the AI chat functionality in your Ventaro application.

## The Issue

If you're seeing this error during deployment:
```
The OPENAI_API_KEY environment variable is missing or empty
```

This means the OpenAI API key is not properly configured in your deployment environment.

## Solution

### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account (create one if needed)
3. Click "Create new secret key"
4. Copy the generated API key (starts with `sk-`)

### Step 2: Configure for Local Development

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### Step 3: Configure for Vercel Deployment

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add a new environment variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-your-actual-api-key-here`
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**

### Step 4: Redeploy Your Application

After adding the environment variable:
1. Go to your project's **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger automatic deployment

## Verification

### Local Testing
1. Run `npm run dev`
2. Open the AI chat widget on your site
3. Send a test message
4. You should receive a response from the AI

### Production Testing
1. Visit your deployed site
2. Test the AI chat functionality
3. If it works, the configuration is correct

## Troubleshooting

### Build Errors
If you're still getting build errors:
1. Make sure the environment variable name is exactly `OPENAI_API_KEY`
2. Ensure there are no extra spaces in the variable name or value
3. Verify the API key starts with `sk-`

### API Key Issues
- **Invalid API Key**: Double-check you copied the full key
- **Quota Exceeded**: Check your OpenAI usage limits
- **Billing Issues**: Ensure your OpenAI account has valid billing setup

### Fallback Behavior
If the OpenAI API is unavailable, the chat will show a fallback message directing users to contact support directly.

## Security Notes

- Never commit your actual API key to version control
- The `.env.local` file is already in `.gitignore`
- Use Vercel's environment variables for secure deployment
- Rotate your API keys periodically for security

## Cost Management

To manage OpenAI API costs:
1. Set usage limits in your OpenAI dashboard
2. Monitor your usage regularly
3. Consider implementing rate limiting for high-traffic sites

## Support

If you continue to have issues:
1. Check the Vercel deployment logs
2. Verify all environment variables are set correctly
3. Contact support with specific error messages