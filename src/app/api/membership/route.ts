import { NextRequest, NextResponse } from 'next/server';
import { MembershipApiResponse, MembershipTier, UserMembership } from '@/types/membership';
import { createClientWithRetry, createAdminClient } from '@/lib/supabase';

/**
 * GET /api/membership
 * 
 * Returns membership tiers and current user's membership status
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClientWithRetry();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get all active membership tiers
    const { data: tiers, error: tiersError } = await supabase
      .from('membership_tiers')
      .select('*')
      .eq('is_active', true)
      .order('tier_level', { ascending: true });

    if (tiersError) {
      console.error('Error fetching membership tiers:', tiersError);
      return NextResponse.json({ error: 'Failed to fetch membership tiers' }, { status: 500 });
    }

    let userMembership: UserMembership | null = null;
    let currentTier: MembershipTier | null = null;

    if (user) {
      // Get user's current membership
      const { data: membership, error: membershipError } = await supabase
        .from('user_memberships')
        .select(`
          *,
          tier:membership_tiers(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (membershipError && membershipError.code !== 'PGRST116') {
        console.error('Error fetching user membership:', membershipError);
      } else if (membership) {
        userMembership = membership;
        currentTier = membership.tier;
      }

      // If no active membership, user is on free tier
      if (!currentTier) {
        currentTier = tiers?.find(tier => tier.id === 'free') || null;
      }
    }

    const response: MembershipApiResponse = {
      tiers: tiers || [],
      user_membership: userMembership || undefined,
      current_tier: currentTier || undefined
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Membership API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/membership
 * 
 * Create or update user membership (for internal use)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { tier_id, billing_cycle, stripe_subscription_id, stripe_customer_id } = body;

    // Validate required fields
    if (!tier_id || !billing_cycle) {
      return NextResponse.json(
        { error: 'Missing required fields: tier_id, billing_cycle' },
        { status: 400 }
      );
    }

    // Verify tier exists
    const { data: tier, error: tierError } = await supabase
      .from('membership_tiers')
      .select('*')
      .eq('id', tier_id)
      .eq('is_active', true)
      .single();

    if (tierError || !tier) {
      return NextResponse.json(
        { error: 'Invalid tier ID' },
        { status: 400 }
      );
    }

    // Cancel any existing active memberships
    const { error: cancelError } = await supabase
      .from('user_memberships')
      .update({ status: 'cancelled' })
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (cancelError) {
      console.error('Error cancelling existing memberships:', cancelError);
    }

    // Create new membership
    const membershipData = {
      user_id: user.id,
      tier_id,
      billing_cycle,
      stripe_subscription_id,
      stripe_customer_id,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: billing_cycle === 'yearly' 
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    const { data: newMembership, error: createError } = await supabase
      .from('user_memberships')
      .insert(membershipData)
      .select(`
        *,
        tier:membership_tiers(*)
      `)
      .single();

    if (createError) {
      console.error('Error creating membership:', createError);
      return NextResponse.json(
        { error: 'Failed to create membership' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      membership: newMembership
    });

  } catch (error) {
    console.error('Membership creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/membership
 * 
 * Update existing membership status
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { status, current_period_end } = body;

    // Validate status
    const validStatuses = ['active', 'cancelled', 'expired', 'paused'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get current active membership
    const { data: currentMembership, error: fetchError } = await supabase
      .from('user_memberships')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (fetchError || !currentMembership) {
      return NextResponse.json(
        { error: 'No active membership found' },
        { status: 404 }
      );
    }

    // Update membership
    const updateData: any = {};
    if (status) updateData.status = status;
    if (current_period_end) updateData.current_period_end = current_period_end;

    const { data: updatedMembership, error: updateError } = await supabase
      .from('user_memberships')
      .update(updateData)
      .eq('id', currentMembership.id)
      .select(`
        *,
        tier:membership_tiers(*)
      `)
      .single();

    if (updateError) {
      console.error('Error updating membership:', updateError);
      return NextResponse.json(
        { error: 'Failed to update membership' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      membership: updatedMembership
    });

  } catch (error) {
    console.error('Membership update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/membership
 * 
 * Cancel user's membership
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Cancel all active memberships
    const { error: cancelError } = await supabase
      .from('user_memberships')
      .update({ status: 'cancelled' })
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (cancelError) {
      console.error('Error cancelling membership:', cancelError);
      return NextResponse.json(
        { error: 'Failed to cancel membership' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Membership cancelled successfully'
    });

  } catch (error) {
    console.error('Membership cancellation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}