import create from 'zustand';
import { supabase } from '../supabaseClient';

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

interface StoreState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

const useStore = create<StoreState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.from('categories').select();
      if (error) throw error;
      set({ categories: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (category) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.from('categories').insert(category);
      if (error) throw error;
      await get().fetchCategories();
    } catch (error) {
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
        .update({ name: category.name, parent_id: category.parent_id })
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
}));

export default useStore;