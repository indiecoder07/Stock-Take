import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Category } from '../types';
import { useStore } from '../store';

interface CategoryDropdownProps {
  onSelect: (categoryId: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ onSelect }) => {
  const { categories, fetchCategories } = useStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getNestedCategories = (parentId: string | null): Category[] => {
    return categories.filter(category => category.parent_id === parentId);
  };

  const handleSelect = (category: Category) => {
    setSelectedCategory(category);
    onSelect(category.id);
    setIsOpen(false);
  };

  const renderCategories = (parentId: string | null, depth = 0) => {
    const nestedCategories = getNestedCategories(parentId);
    
    if (nestedCategories.length === 0 && depth === 0) {
      return (
        <div className="px-4 py-2 text-sm text-gray-500">
          No categories available
        </div>
      );
    }
    
    return nestedCategories.map((category) => (
      <div key={category.id} style={{ paddingLeft: `${depth * 1}rem` }}>
        <button
          type="button"
          onClick={() => handleSelect(category)}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none text-sm"
        >
          {category.name}
        </button>
        {renderCategories(category.id, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-300 rounded-md px-4 py-2 inline-flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span>{selectedCategory?.name || 'Select Category'}</span>
        <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {renderCategories(null)}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;