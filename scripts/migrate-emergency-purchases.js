#!/usr/bin/env node

/**
 * EMERGENCY PURCHASE MIGRATION SCRIPT
 * This script migrates purchases from emergency file storage to Supabase
 * Run this after configuring Supabase properly
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function migrateEmergencyPurchases() {
  console.log('🚨 EMERGENCY PURCHASE MIGRATION');
  console.log('================================\n');

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || supabaseUrl.includes('placeholder') || !supabaseKey || supabaseKey.includes('placeholder')) {
    console.log('❌ Supabase not configured. Please configure Supabase first.');
    console.log('   Update .env.local with real Supabase credentials.');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Check emergency purchases directory
  const emergencyDir = path.join(process.cwd(), 'emergency-purchases');
  
  try {
    const files = await fs.readdir(emergencyDir);
    const purchaseFiles = files.filter(file => file.endsWith('.json'));

    if (purchaseFiles.length === 0) {
      console.log('✅ No emergency purchases found to migrate.');
      return;
    }

    console.log(`📋 Found ${purchaseFiles.length} emergency purchases to migrate:\n`);

    let migrated = 0;
    let failed = 0;

    for (const file of purchaseFiles) {
      try {
        const filePath = path.join(emergencyDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const purchase = JSON.parse(content);

        console.log(`📦 Migrating: ${purchase.customer_email} - ${purchase.product_name}`);

        // Remove emergency-specific fields
        const cleanPurchase = {
          user_id: purchase.user_id,
          customer_email: purchase.customer_email,
          product_id: purchase.product_id,
          product_name: purchase.product_name,
          price_id: purchase.price_id,
          amount: purchase.amount,
          currency: purchase.currency,
          status: purchase.status,
          stripe_session_id: purchase.stripe_session_id,
          stripe_customer_id: purchase.stripe_customer_id,
          stripe_product_id: purchase.stripe_product_id,
          created_at: purchase.created_at
        };

        // Insert into Supabase
        const { data, error } = await supabase
          .from('purchases')
          .insert([cleanPurchase])
          .select()
          .single();

        if (error) {
          console.log(`   ❌ Failed: ${error.message}`);
          failed++;
        } else {
          console.log(`   ✅ Migrated successfully (ID: ${data.id})`);
          
          // Move file to migrated folder
          const migratedDir = path.join(emergencyDir, 'migrated');
          await fs.mkdir(migratedDir, { recursive: true });
          await fs.rename(filePath, path.join(migratedDir, file));
          
          migrated++;
        }

      } catch (error) {
        console.log(`   ❌ Error processing ${file}: ${error.message}`);
        failed++;
      }
    }

    console.log(`\n📊 MIGRATION SUMMARY:`);
    console.log(`   ✅ Successfully migrated: ${migrated}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📁 Migrated files moved to: emergency-purchases/migrated/`);

    if (migrated > 0) {
      console.log('\n🎉 Emergency purchases successfully migrated to Supabase!');
      console.log('   Users can now access their purchased content.');
    }

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('✅ No emergency purchases directory found. No migration needed.');
    } else {
      console.log('❌ Error during migration:', error.message);
    }
  }
}

// Test database connection first
async function testConnection() {
  console.log('🔧 Testing Supabase connection...');
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('purchases')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Database connection failed:', error.message);
      console.log('   Please ensure Supabase is properly configured and tables exist.');
      return false;
    } else {
      console.log('✅ Database connection successful\n');
      return true;
    }
  } catch (e) {
    console.log('❌ Database connection error:', e.message);
    return false;
  }
}

async function main() {
  const connected = await testConnection();
  
  if (connected) {
    await migrateEmergencyPurchases();
  } else {
    console.log('\n🔧 SETUP REQUIRED:');
    console.log('   1. Configure Supabase credentials in .env.local');
    console.log('   2. Run: node scripts/setup-database-tables.js');
    console.log('   3. Run this migration script again');
  }
}

main().catch(console.error);