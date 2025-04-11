export interface Item {
  id: string;
  name: string;
  category_id: string;
  quantity: number;
  unit: string;
  normal_required_stock: number;
  busy_required_stock: number;
  last_stocktake_date: string;
  notes: string;
  min_threshold: number;
  max_threshold: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  created_at?: string;
}

export interface StocktakeEntry {
  id: string;
  item_id: string;
  quantity: number;
  created_at: string;
  user_id: string;
  notes: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
}