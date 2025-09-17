import { NextRequest, NextResponse } from 'next/server';
import { getStripeInstance } from '@/lib/stripe';
import type { Stripe } from 'stripe';
import { supabase } from '@/lib/supabase';
import { env } from '@/lib/env';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { PRODUCT_MAPPINGS, LEGACY_PRODUCT_MAPPINGS } from '@/config/products';
import { optimizedDatabaseQuery, optimizedApiCall } from '@/lib/system-optimizer';
import { v4 as uuidv4 } from 'uuid';

// Product ID mapping for compatibility
const productIdMapping: Record<string, string> = {
  ...PRODUCT_MAPPINGS,
  ...LEGACY_PRODUCT_MAPPINGS
};

const mockProducts = [
  {
    id: '1',
    name: 'AI Tools Mastery Guide 2025',
    description: '30-page guide for AI tools to make money online in 2025. Learn ChatGPT, Claude, Grok, Gemini, and proven strategies to make money with AI.',
    price: 25.00,
    image_url: '/images/products/ai-tools-mastery-guide.svg',
    category: 'E-book',
    featured: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'AI Prompts Arsenal 2025',
    description: '30 professional AI prompts to build an online business with AI. Proven ChatGPT and Claude prompts for content creation, marketing automation, and AI-powered business growth.',
    price: 10.00,
    image_url: '/images/products/ai-prompts-arsenal.svg',
    category: 'AI Prompts',
    featured: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'AI Web Creation Masterclass',
    description: 'Complete step by step video showing our process to create a fully operational online business from start-to-finish within 2 hours, including all tools and steps required to build a fully operational online business with AI.',
    price: 50.00,
    image_url: '/images/products/ai-business-video-guide.svg',
    category: 'Video',
    featured: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Support Package',
    description: 'Premium email support for 1 month with expert guidance on implementing your AI website. Perfect for scaling your AI business with professional assistance.',
    price: 300.00,
    image_url: '/images/products/weekly-support.svg',
    category: 'Support',
    featured: false,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'vai-beginners-mastery',
    name: 'VAI Beginners Mastery',
    description: 'Personalized 1-on-1 coaching session to master AI fundamentals and build your first profitable AI project. September 2025 special offer.',
    price: 250.00,
    image_url: '/images/products/coaching-session.svg',
    category: 'Coaching',
    featured: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'vai-web-dev-elite',
    name: 'VAI Web Development Elite',
    description: 'Advanced 1-on-1 coaching for building sophisticated AI-powered web applications and scaling your development skills. September 2025 special offer.',
    price: 250.00,
    image_url: '/images/products/coaching-session.svg',
    category: 'Coaching',
    featured: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'ai-business-strategy',
    name: 'AI Business Strategy Session',
    description: 'Strategic 1-on-1 coaching session to develop AI implementation roadmap for business growth and competitive advantage. September 2025 special offer.',
    price: 250.00,
    image_url: '/images/products/coaching-session.svg',
    category: 'Coaching',
    featured: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'test',
    name: 'Test Product',
    description: 'Test product for development',
    price: 10.00,
    image_url: '/images/products/test-product.svg',
    category: 'Test',
    featured: false,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// Helper function to normalize product ID
function normalizeProductId(productId: string): string {
  return productIdMapping[productId] || productId;
}

export async function POST(request: NextRequest) {
  try {
    // Check for authentication using NextAuth session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.log('Blocking checkout attempt from unauthenticated user');
      return NextResponse.json(
        { error: 'Authentication required. Please log in to make a purchase.' },
        { status: 401 }
      );
    }
    
    // Validate Stripe environment variables
    if (!env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.error('Missing Stripe configuration');
      return NextResponse.json(
        { error: 'Payment system configuration error' },
        { status: 500 }
      );
    }

    const requestData = await request.json();
    const items = requestData.items;

    if (!items || !items.length) {
      console.error('Invalid request format:', requestData);
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }
    
    console.log('Received checkout request with items:', JSON.stringify(items));
    
    const cartItems = items; // For compatibility with the rest of the code

    // Fetch product details from database with optimization
    // Normalize product IDs to handle both old and new ID formats
    const productIds = cartItems.map((item: any) => normalizeProductId(item.id));
    
    const productsData = await optimizedDatabaseQuery(async () => {
      try {
        const productQuery = supabase
          .from('products')
          .select('id, name, price, image_url, category')
          .in('id', productIds);
        
        const { data, error } = await productQuery;
        
        if (error) {
          // If database table doesn't exist or UUID validation fails, use mock data
          if (error.code === '42P01' || error.code === '22P02') {
            console.log('⚠️ Database table not found or UUID validation failed, using mock data for checkout');
            return mockProducts.filter(product => productIds.includes(product.id));
          } else {
            console.error('Database query error:', error);
            // For any other database error, fall back to mock data
            return mockProducts.filter(product => productIds.includes(product.id));
          }
        }
        
        // If we got data from database, use it; otherwise fall back to mock data
        if (data && data.length > 0) {
          return data;
        } else {
          console.log('⚠️ No products found in database, using mock data');
          return mockProducts.filter(product => productIds.includes(product.id));
        }
      } catch (dbError) {
        console.error('Database connection error:', dbError);
        // If there's any database connection issue, use mock data
        return mockProducts.filter(product => productIds.includes(product.id));
      }
    }, `products-${productIds.join('-')}`);
    
    if (!Array.isArray(productsData) || productsData.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch product details' },
        { status: 500 }
      );
    }

    // Create product metadata and line items for Stripe checkout
    const productMetadata = cartItems.map((item: any) => {
      const normalizedId = normalizeProductId(item.id);
      const product = productsData.find((p: any) => p.id === normalizedId);
      
      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }
      
      // Determine download URL based on product category
      let download_url = null;
      if (product.category === 'E-book') {
        download_url = '/downloads/ebook';
      } else if (product.category === 'AI Prompts') {
        download_url = '/downloads/prompts';
      }
      // Coaching calls don't have download URLs
      
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        download_url
      };
    });
    
    // Create line items for Stripe checkout
    const lineItems = productMetadata.map((product: any) => {
      // Find the original product data to get the image_url
      const originalProduct = productsData.find((p: any) => p.id === product.id);
      
      // Prepare image URLs - Stripe requires absolute URLs
      let imageUrls: string[] = [];
      if (originalProduct?.image_url) {
        // If the image URL is relative (starts with '/'), convert it to absolute URL
        if (originalProduct.image_url.startsWith('/')) {
          // Skip images for now as we don't have a proper domain
          // In production, you would use something like:
          // imageUrls = [`https://yourdomain.com${originalProduct.image_url}`];
        } else if (originalProduct.image_url.startsWith('http')) {
          // If it's already an absolute URL, use it
          imageUrls = [originalProduct.image_url];
        }
      }
      
      return {
        price_data: {
          currency: 'aud',
          product_data: {
            name: product.name,
            images: imageUrls,
            metadata: {
              product_id: product.id,
              download_url: product.download_url || null
            }
          },
          unit_amount: Math.round(product.price * 100), // Convert to cents
        },
        quantity: product.quantity,
      };
    });

    // Calculate order total
    const orderTotal = cartItems.reduce((total: number, item: any) => {
      const product = productsData.find((p: any) => p.id === item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);

    // Create a new order in the database with optimization
    
    // Create a guest ID for the order
    const guestId = `guest_${uuidv4()}`;
    const orderId = uuidv4();
    
    let orderData: any;
    try {
      orderData = await optimizedDatabaseQuery(async () => {
        // Try to create order in database
        const orderQuery = supabase
          .from('orders')
          .insert([
            {
              user_id: guestId,
              status: 'pending',
              total: orderTotal,
            },
          ])
          .select()
          .single();
        
        const { data, error } = await orderQuery;
        
        if (error) {
          // If database table doesn't exist or UUID validation fails, use mock order
          if (error.code === '42P01' || error.code === '22P02') {
            console.log('⚠️ Orders table not found or UUID validation failed, using mock order');
            return {
              id: orderId,
              user_id: guestId,
              status: 'pending',
              total: orderTotal,
              created_at: new Date().toISOString()
            };
          } else {
            console.error('Database error creating order:', error);
            // For any other database error, fall back to mock order
            return {
              id: orderId,
              user_id: guestId,
              status: 'pending',
              total: orderTotal,
              created_at: new Date().toISOString()
            };
          }
        }
        
        return data || {
          id: orderId,
          user_id: guestId,
          status: 'pending',
          total: orderTotal,
          created_at: new Date().toISOString()
        };
      }, `order-${guestId}`);
    } catch (error) {
      console.error('Failed to create order with optimization:', error);
      // Fallback to direct database call
      const { data, error: dbError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: guestId,
            status: 'pending',
            total: orderTotal,
          },
        ])
        .select()
        .single();
      
      if (dbError) {
        console.error('Direct database call also failed:', dbError);
        if (dbError.code === '42P01' || dbError.code === '22P02') {
          console.log('⚠️ Orders table not found or UUID validation failed, using mock order');
          orderData = {
            id: orderId,
            user_id: guestId,
            status: 'pending',
            total: orderTotal,
            created_at: new Date().toISOString()
          };
        } else {
          console.error('Other database error, using mock order:', dbError);
          orderData = {
            id: orderId,
            user_id: guestId,
            status: 'pending',
            total: orderTotal,
            created_at: new Date().toISOString()
          };
        }
      } else {
        orderData = data;
      }
    }
    
    if (!orderData || typeof orderData !== 'object') {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order items with enhanced error handling
    const orderItems = cartItems.map((item: any) => {
      const product = productsData.find((p: any) => p.id === item.id);
      return {
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price: product?.price || 9.99,
      };
    });

    // Create order items with optimization
    await optimizedDatabaseQuery(async () => {
      const itemsQuery = supabase
        .from('order_items')
        .insert(orderItems);
      
      const { error } = await itemsQuery;
      
      if (error) {
        // If database table doesn't exist or UUID validation fails, log and continue
        if (error.code === '42P01' || error.code === '22P02') {
          console.log('⚠️ Order items table not found or UUID validation failed, continuing with checkout');
          return orderItems;
        } else {
          console.error('Database error creating order items:', error);
          // For any other database error, continue with checkout
          return orderItems;
        }
      }
      
      return orderItems;
    }, `order-items-${orderData.id}`);

    // Create Stripe checkout session with optimization
    // Use NEXT_PUBLIC_SITE_URL for production or fallback to origin header for local dev
    const origin = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin') || 'http://localhost:3001';
    console.log('Creating Stripe checkout session with origin:', origin);
    
    // Get user information from session
    const userId = session.user.id;
    const userEmail = session.user.email;
    
    console.log(`Creating checkout session for user: ${userId}, email: ${userEmail}`);
    
    let stripeSession: any;
    try {
      stripeSession = await optimizedApiCall(async () => {
        try {
          const stripe = await getStripeInstance();
          return await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/my-account?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/products`,
            customer_email: userEmail,
            client_reference_id: userId,
            metadata: {
              userId: userId,
              userEmail: userEmail,
              products: JSON.stringify(cartItems.map((item: any) => item.id)),
            },
            allow_promotion_codes: true,
            billing_address_collection: 'auto',
            currency: 'usd',
            custom_text: {
              submit: {
                message: 'Complete your purchase'
              }
            },
            ui_mode: 'hosted'
          });
        } catch (error) {
          console.error('Error creating Stripe checkout session:', error);
          const stripeError = error as any;
          console.error('Stripe error details:', {
            message: stripeError.message,
            type: stripeError.type,
            code: stripeError.code,
            statusCode: stripeError.statusCode,
            requestId: stripeError.requestId
          });
          throw error; // Let the catch block handle the fallback
        }
      }, `stripe-session-${Date.now()}`, 300000); // Cache for 5 minutes
    } catch (error) {
      console.error('Failed to create Stripe session with optimization:', error);
      // Direct Stripe call as fallback
      try {
        const stripe = await getStripeInstance();
        stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${origin}/my-account?session_id={CHECKOUT_SESSION_ID}&order_id=${orderData.id}&guest=true`,
          cancel_url: `${origin}/products`,
          metadata: {
            order_id: orderData.id,
            user_id: guestId,
            is_guest: 'true',
            currency: 'aud',
          },
          allow_promotion_codes: true,
          billing_address_collection: 'auto',
          currency: 'aud',
          custom_text: {
            submit: {
              message: 'Complete your purchase'
            }
          },
          ui_mode: 'hosted'
        });
      } catch (stripeError) {
        console.error('Direct Stripe call also failed:', stripeError);
        const errorDetails = stripeError as any;
        console.error('Direct Stripe error details:', {
          message: errorDetails.message,
          type: errorDetails.type,
          code: errorDetails.code,
          statusCode: errorDetails.statusCode,
          requestId: errorDetails.requestId
        });
        // Fallback to mock session if Stripe fails completely
        console.log('Using mock checkout session due to Stripe error');
        stripeSession = {
          url: 'https://example.com/mock-checkout',
          id: 'mock_session_id'
        };
      }
    }

    // No email sending - instant access via Stripe payment completion
    
    console.log('Stripe session created:', { 
      url: stripeSession.url ? 'URL exists' : 'URL is missing', 
      id: stripeSession.id ? 'ID exists' : 'ID is missing' 
    });
    
    return NextResponse.json({ 
      url: stripeSession.url,
      sessionId: stripeSession.id 
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during checkout' },
      { status: 500 }
    );
  }
}