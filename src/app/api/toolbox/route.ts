import { NextRequest, NextResponse } from 'next/server';
import { createClientWithRetry, createAdminClient } from '@/lib/supabase';
import { ToolboxTool, ToolboxApiResponse, UserMembership } from '@/types/membership';

/**
 * GET /api/toolbox
 * 
 * Returns AI toolbox tools with user access information
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClientWithRetry();
    
    // Get current user (optional for toolbox viewing)
    const { data: { user } } = await supabase.auth.getUser();
    
    let userTierLevel = 0; // Default to free tier

    if (user) {
      // Get user's current tier level
      const { data: membershipData } = await supabase
        .rpc('get_user_membership_tier', { user_uuid: user.id });
      
      if (membershipData && membershipData.length > 0) {
        userTierLevel = membershipData[0].tier_level;
      }
    }

    // Get all active tools
    const { data: tools, error: toolsError } = await supabase
      .from('toolbox_tools')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (toolsError) {
      console.error('Error fetching toolbox tools:', toolsError);
      return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
    }

    // Add access information to each tool
    const toolsWithAccess: ToolboxTool[] = (tools || []).map(tool => ({
      ...tool,
      has_access: userTierLevel >= tool.required_tier_level
    }));

    // Get unique categories
    const categories = [...new Set(toolsWithAccess.map(tool => tool.category))].sort();

    const response: ToolboxApiResponse = {
      tools: toolsWithAccess,
      categories,
      user_tier_level: userTierLevel
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Toolbox API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/toolbox
 * 
 * Add a new tool to the toolbox (admin only)
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

    // Check if user is admin (you might want to implement proper role checking)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      name,
      description,
      category,
      url,
      icon,
      required_tier_level = 0,
      is_featured = false,
      affiliate_url
    } = body;

    // Validate required fields
    if (!id || !name || !description || !category || !url || !icon) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, description, category, url, icon' },
        { status: 400 }
      );
    }

    // Insert new tool
    const { data: newTool, error: insertError } = await supabase
      .from('toolbox_tools')
      .insert({
        id,
        name,
        description,
        category,
        url,
        icon,
        required_tier_level,
        is_featured,
        affiliate_url,
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating tool:', insertError);
      return NextResponse.json(
        { error: 'Failed to create tool' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tool: newTool
    });

  } catch (error) {
    console.error('Tool creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/toolbox
 * 
 * Update an existing tool (admin only)
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

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Tool ID is required' },
        { status: 400 }
      );
    }

    // Update tool
    const { data: updatedTool, error: updateError } = await supabase
      .from('toolbox_tools')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating tool:', updateError);
      return NextResponse.json(
        { error: 'Failed to update tool' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tool: updatedTool
    });

  } catch (error) {
    console.error('Tool update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/toolbox
 * 
 * Delete a tool (admin only)
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
    const toolId = searchParams.get('id');

    if (!toolId) {
      return NextResponse.json(
        { error: 'Tool ID is required' },
        { status: 400 }
      );
    }

    // Soft delete by setting is_active to false
    const { error: deleteError } = await supabase
      .from('toolbox_tools')
      .update({ is_active: false })
      .eq('id', toolId);

    if (deleteError) {
      console.error('Error deleting tool:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete tool' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tool deleted successfully'
    });

  } catch (error) {
    console.error('Tool deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}