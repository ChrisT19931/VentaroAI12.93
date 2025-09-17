-- Create product_interest table for tracking user interest in products
CREATE TABLE IF NOT EXISTS product_interest (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  source VARCHAR(100) DEFAULT 'unknown',
  user_ip VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_interest_product_name ON product_interest(product_name);
CREATE INDEX IF NOT EXISTS idx_product_interest_created_at ON product_interest(created_at);
CREATE INDEX IF NOT EXISTS idx_product_interest_source ON product_interest(source);

-- Enable Row Level Security
ALTER TABLE product_interest ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage all data
DROP POLICY IF EXISTS "Service role can manage product_interest" ON product_interest;
CREATE POLICY "Service role can manage product_interest" ON product_interest
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy to allow anyone to insert interest (for anonymous users)
DROP POLICY IF EXISTS "Anyone can insert product_interest" ON product_interest;
CREATE POLICY "Anyone can insert product_interest" ON product_interest
  FOR INSERT WITH CHECK (true);

-- Insert a test record to verify the table works
INSERT INTO product_interest (product_name, source, user_ip) 
VALUES ('AI Web Creation Masterclass', 'setup_test', '127.0.0.1');

-- Clean up the test record
DELETE FROM product_interest WHERE source = 'setup_test';

-- Show table structure
\d product_interest;

SELECT 'Product interest table setup completed successfully!' as status;