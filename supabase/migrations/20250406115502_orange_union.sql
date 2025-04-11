/*
  # Fix Categories Table RLS Policies

  1. Changes
    - Drop all existing policies on categories table
    - Create comprehensive RLS policies for categories
      - Allow authenticated users to read all categories
      - Allow authenticated users to insert new categories
      - Allow authenticated users to update categories
  
  2. Security
    - Maintains RLS enabled on the table
    - Ensures authenticated users have proper access
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can read categories" ON categories;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON categories;

-- Ensure RLS is enabled
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies
CREATE POLICY "Enable read access for all authenticated users"
ON categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON categories
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON categories
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);