import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { AffiliateClick } from '@/types/membership';
import { createClientWithRetry, createAdminClient } from '@/lib/supabase';

/**
 * POST /api/toolbox/track-click
 * 
 * Track affiliate clicks for analytics and revenue tracking
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClientWithRetry();
    const headersList = headers();
    
    // Get current user (optional)
    const { data: { user } } = await supabase.auth.getUser();
    
    const body = await request.json();
    const { tool_id, clicked_url } = body;

    // Validate required fields
    if (!tool_id || !clicked_url) {
      return NextResponse.json(
        { error: 'Missing required fields: tool_id, clicked_url' },
        { status: 400 }
      );
    }

    // Verify tool exists
    const { data: tool, error: toolError } = await supabase
      .from('toolbox_tools')
      .select('id, name, affiliate_url')
      .eq('id', tool_id)
      .eq('is_active', true)
      .single();

    if (toolError || !tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }

    // Get client IP and user agent
    const forwarded = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const clientIp = forwarded ? forwarded.split(',')[0] : realIp;
    const userAgent = headersList.get('user-agent');

    // Track the click
    const clickData = {
      user_id: user?.id || null,
      tool_id,
      clicked_url,
      ip_address: clientIp,
      user_agent: userAgent
    };

    const { data: clickRecord, error: insertError } = await supabase
      .from('affiliate_clicks')
      .insert(clickData)
      .select()
      .single();

    if (insertError) {
      console.error('Error tracking click:', insertError);
      // Don't fail the request if tracking fails
      return NextResponse.json({
        success: true,
        message: 'Click processed (tracking failed)',
        tool_name: tool.name
      });
    }

    // Optional: Update tool usage statistics
    try {
      // You could implement a counter or analytics update here
      // For now, we'll just log successful tracking
      console.log(`Tracked click for tool ${tool.name} by user ${user?.id || 'anonymous'}`);
    } catch (analyticsError) {
      console.error('Analytics update failed:', analyticsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Click tracked successfully',
      tool_name: tool.name,
      click_id: clickRecord.id
    });

  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/toolbox/track-click
 * 
 * Get click analytics (admin only)
 */
export async function GET(request: NextRequest) {
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

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('tool_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = supabase
      .from('affiliate_clicks')
      .select(`
        *,
        tool:toolbox_tools(id, name, category),
        user:profiles(id, email, full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Apply filters
    if (toolId) {
      query = query.eq('tool_id', toolId);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: clicks, error: clicksError } = await query;

    if (clicksError) {
      console.error('Error fetching click analytics:', clicksError);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }

    // Get summary statistics
    const totalClicks = clicks?.length || 0;
    const uniqueUsers = new Set(clicks?.map(click => click.user_id).filter(Boolean)).size;
    const clicksByTool = clicks?.reduce((acc: Record<string, number>, click) => {
      const toolName = click.tool?.name || 'Unknown';
      acc[toolName] = (acc[toolName] || 0) + 1;
      return acc;
    }, {}) || {};

    // Get top tools by clicks
    const topTools = Object.entries(clicksByTool)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return NextResponse.json({
      success: true,
      analytics: {
        total_clicks: totalClicks,
        unique_users: uniqueUsers,
        clicks_by_tool: clicksByTool,
        top_tools: topTools,
        recent_clicks: clicks?.slice(0, 20) || []
      },
      filters: {
        tool_id: toolId,
        start_date: startDate,
        end_date: endDate,
        limit
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/toolbox/track-click
 * 
 * Clear old click data (admin only)
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

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const daysOld = parseInt(searchParams.get('days_old') || '90');

    // Delete clicks older than specified days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { data, error: deleteError } = await supabase
      .from('affiliate_clicks')
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    if (deleteError) {
      console.error('Error deleting old clicks:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete old clicks' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Deleted clicks older than ${daysOld} days`,
      cutoff_date: cutoffDate.toISOString()
    });

  } catch (error) {
    console.error('Click cleanup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}