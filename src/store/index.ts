import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Item, Category, StocktakeEntry, User } from '../types';

interface StoreState {
  items: Item[];
  categories: Category[];
  entries: StocktakeEntry[];
  currentUser: User | null;
  selectedCategory: string | null;
  isAddItemModalOpen: boolean;
  isAddCategoryModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  setItems: (items: Item[]) => void;
  addItem: (item: Omit<Item, 'id' | 'last_stocktake_date'>) => Promise<void>;
  updateItem: (item: Item) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  setCategories: (categories: Category[]) => void;
  addCategory: (category: { name: string; parent_id: string | null }) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addEntry: (entry: Omit<StocktakeEntry, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setIsAddItemModalOpen: (isOpen: boolean) => void;
  setIsAddCategoryModalOpen: (isOpen: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  items: [],
  categories: [],
  entries: [],
  currentUser: null,
  selectedCategory: null,
  isAddItemModalOpen: false,
  isAddCategoryModalOpen: false,
  isLoading: false,
  error: null,

  fetchItems: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ items: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      console.log('Fetched categories:', data); // Debug log
      set({ categories: data || [] });
    } catch (error) {
      console.error('Error fetching categories:', error); // Debug log
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  setItems: (items) => set({ items }),

  addItem: async (item) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('items')
        .insert([{
          ...item,
          last_stocktake_date: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error in addItem:', error);
        throw error;
      }
      set((state) => ({
        items: [
          ...state.items,
          {
            id: data.id,
            name: data.name,
            categoryId: data.category_id,
            quantity: data.quantity,
            unit: data.unit,
            normalRequiredStock: data.normal_required_stock,
            busyRequiredStock: data.busy_required_stock,
            lastStocktakeDate: data.last_stocktake_date,
            notes: data.notes,
            minThreshold: data.min_threshold,
            maxThreshold: data.max_threshold,
          },
        ],
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (item) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase
        .from('items')
        .update(item)
        .eq('id', item.id);

      if (error) throw error;
      await get().fetchItems();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteItem: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchItems();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setCategories: (categories) => set({ categories }),

  addCategory: async (category) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: category.name,
          parent_id: category.parent_id
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to add category');
      }

      if (!data) {
        throw new Error('No data returned from insert');
      }

      // Manually fetch categories to ensure consistency
      await get().fetchCategories();
      
    } catch (error) {
      console.error('Error adding category:', error);
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (category) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase
        .from('categories')
        .update({
          name: category.name,
          parent_id: category.parent_id
        })
        .eq('id', category.id);

      if (error) throw error;
      await get().fetchCategories();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchCategories();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addEntry: async (entry) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('stocktake_entries')
        .insert([{
          ...entry,
          user_id: get().currentUser?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ entries: [...state.entries, data] }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentUser: (user) => set({ currentUser: user }),
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
  setIsAddItemModalOpen: (isOpen) => set({ isAddItemModalOpen: isOpen }),
  setIsAddCategoryModalOpen: (isOpen) => set({ isAddCategoryModalOpen: isOpen }),
  setError: (error) => set({ error }),
}));