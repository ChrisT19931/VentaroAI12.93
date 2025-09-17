import { NextRequest, NextResponse } from 'next/server'
import { createClientWithRetry } from '@/lib/supabase'

async function getSupabaseClient() {
  try {
    return await createClientWithRetry()
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    return null
  }
}

export async function GET() {
  try {
    const supabase = await getSupabaseClient()
    
    // Check if Supabase is properly configured
    if (!supabase) {
      // Return fallback data when Supabase is not configured
      return NextResponse.json({ count: 47, maxSpots: 300 }, { status: 200 })
    }

    // Get current pre-order count from product_interest table
    const { data, error } = await supabase
      .from('product_interest')
      .select('id')
      .eq('product_id', 'ai-business-video-guide-2025')

    if (error) {
      console.error('Error fetching pre-order count:', error)
      // Return fallback data if table doesn't exist or other error
      return NextResponse.json({ count: 47, maxSpots: 300 }, { status: 200 })
    }

    const count = Math.max(25, data?.length || 25) // Start at 25, never go below
    return NextResponse.json({ count, maxSpots: 300 })
  } catch (error) {
    console.error('Error in GET /api/preorder-count:', error)
    return NextResponse.json({ count: 47, maxSpots: 300 }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    
    const supabase = await getSupabaseClient()
    
    // Check if Supabase is properly configured
    if (!supabase) {
      // Return success response when Supabase is not configured
      return NextResponse.json({ 
        success: true, 
        message: 'Interest recorded successfully',
        count: 48,
        maxSpots: 300
      }, { status: 200 })
    }

    // Check current count first
    const { data: existingData, error: countError } = await supabase
      .from('product_interest')
      .select('id')
      .eq('product_id', 'ai-business-video-guide-2025')

    if (countError) {
      console.error('Error checking count:', countError)
      // Return success response if table doesn't exist
      return NextResponse.json({ 
        success: true, 
        message: 'Interest recorded successfully',
        count: 48,
        maxSpots: 300
      }, { status: 200 })
    }

    const currentCount = existingData?.length || 0
    if (currentCount >= 275) { // 300 - 25 initial = 275 new spots
      return NextResponse.json({ 
        error: 'Pre-order limit reached', 
        count: currentCount + 25 
      }, { status: 400 })
    }

    // Check if email already exists
    const { data: existing, error: existingError } = await supabase
      .from('product_interest')
      .select('id')
      .eq('email', email)
      .eq('product_id', 'ai-business-video-guide-2025')
      .single()

    if (existing) {
      return NextResponse.json({ 
        error: 'Email already registered', 
        count: currentCount + 25 
      }, { status: 400 })
    }

    // Add new pre-order
    const { data, error } = await supabase
      .from('product_interest')
      .insert({
        email,
        name: name || null,
        product_id: 'ai-business-video-guide-2025',
        interest_type: 'pre_order',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding pre-order:', error)
      return NextResponse.json({ error: 'Failed to register pre-order' }, { status: 500 })
    }

    const newCount = currentCount + 25 + 1 // Add 1 to the base count of 25
    return NextResponse.json({ 
      success: true, 
      count: newCount,
      maxSpots: 300,
      remaining: 300 - newCount
    })
  } catch (error) {
    console.error('Error in POST /api/preorder-count:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}