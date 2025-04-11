/*
  # Initial Schema Setup for Stocktake Management System

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `parent_id` (uuid, self-referential foreign key)
      - `created_at` (timestamp)

    - `items`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `category_id` (uuid, foreign key)
      - `quantity` (integer)
      - `unit` (text)
      - `normal_required_stock` (integer)
      - `busy_required_stock` (integer)
      - `last_stocktake_date` (timestamp)
      - `notes` (text)
      - `min_threshold` (integer)
      - `max_threshold` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `stocktake_entries`
      - `id` (uuid, primary key)
      - `item_id` (uuid, foreign key)
      - `quantity` (integer)
      - `notes` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read all categories
      - Read all items
      - Create and read stocktake entries
*/

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy for reading categories
CREATE POLICY "Anyone can read categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Create items table
CREATE TABLE items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid REFERENCES categories(id),
  quantity integer DEFAULT 0,
  unit text NOT NULL,
  normal_required_stock integer DEFAULT 0,
  busy_required_stock integer DEFAULT 0,
  last_stocktake_date timestamptz DEFAULT now(),
  notes text DEFAULT '',
  min_threshold integer DEFAULT 0,
  max_threshold integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for items
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policy for reading items
CREATE POLICY "Anyone can read items"
  ON items
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for updating items
CREATE POLICY "Authenticated users can update items"
  ON items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create stocktake entries table
CREATE TABLE stocktake_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id),
  quantity integer NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS for stocktake entries
ALTER TABLE stocktake_entries ENABLE ROW LEVEL SECURITY;

-- Create policy for reading stocktake entries
CREATE POLICY "Users can read all stocktake entries"
  ON stocktake_entries
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for creating stocktake entries
CREATE POLICY "Users can create stocktake entries"
  ON stocktake_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert initial categories
DO $$
DECLARE
  beverages_id uuid;
  food_id uuid;
  hot_drinks_id uuid;
  cold_drinks_id uuid;
BEGIN
  -- Insert main categories
  INSERT INTO categories (name, parent_id) VALUES ('Beverages', null) RETURNING id INTO beverages_id;
  INSERT INTO categories (name, parent_id) VALUES ('Food', null) RETURNING id INTO food_id;
  
  -- Insert subcategories
  INSERT INTO categories (name, parent_id) VALUES ('Hot Drinks', beverages_id) RETURNING id INTO hot_drinks_id;
  INSERT INTO categories (name, parent_id) VALUES ('Cold Drinks', beverages_id) RETURNING id INTO cold_drinks_id;
  INSERT INTO categories (name, parent_id) VALUES ('Snacks', food_id);
  INSERT INTO categories (name, parent_id) VALUES ('Meals', food_id);

  -- Insert initial items
  INSERT INTO items (
    name, category_id, quantity, unit,
    normal_required_stock, busy_required_stock,
    notes, min_threshold, max_threshold
  ) VALUES
    (
      'Coffee Beans',
      hot_drinks_id,
      50,
      'kg',
      75,
      100,
      'Premium Arabica beans',
      30,
      120
    ),
    (
      'Soft Drinks',
      cold_drinks_id,
      200,
      'bottles',
      250,
      400,
      'Various flavors',
      100,
      500
    );
END $$;