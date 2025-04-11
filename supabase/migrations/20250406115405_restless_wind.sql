/*
  # Fix Categories RLS Policy

  1. Changes
    - Drop existing SELECT policy for categories table
    - Create new SELECT policy that properly allows authenticated users to read all categories
  
  2. Security
    - Ensures authenticated users can read all categories
    - Maintains RLS enabled on the table
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can read categories" ON categories;

-- Create new policy with correct configuration
CREATE POLICY "Enable read access for authenticated users" 
ON categories
FOR SELECT 
TO authenticated
USING (true);