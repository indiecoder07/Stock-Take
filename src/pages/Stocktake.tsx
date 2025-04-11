import React from 'react';
import { useStore } from '../store';
import CategoryDropdown from '../components/CategoryDropdown';
import { ClipboardCheck, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const Stocktake: React.FC = () => {
  const { 
    items, 
    addEntry, 
    updateItem,
    fetchItems,
    isLoading 
  } = useStore();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [savedStates, setSavedStates] = React.useState<Record<string, boolean>>({});
  const [notes, setNotes] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = selectedCategory
    ? items.filter(item => item.categoryId === selectedCategory)
    : [];

  const handleCountChange = async (itemId: string, value: string, currentItem: typeof items[0]) => {
    const numValue = parseInt(value) || 0;
    setSavedStates(prev => ({ ...prev, [itemId]: false }));

    try {
      // Add stocktake entry
      await addEntry({
        itemId,
        quantity: numValue,
        notes: notes[itemId] || ''
      });

      // Update item quantity and last stocktake date
      await updateItem({
        ...currentItem,
        quantity: numValue,
        lastStocktakeDate: new Date().toISOString()
      });

      // Show saved indicator
      setSavedStates(prev => ({ ...prev, [itemId]: true }));
      
      // Reset saved indicator after 2 seconds
      setTimeout(() => {
        setSavedStates(prev => ({ ...prev, [itemId]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to save count:', error);
    }
  };

  const handleNotesChange = (itemId: string, value: string) => {
    setNotes(prev => ({ ...prev, [itemId]: value }));
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Stocktake</h1>
          <div className="text-sm text-gray-500">
            {isLoading ? 'Saving...' : 'Changes save automatically'}
          </div>
        </div>

        <div className="mt-6">
          <CategoryDropdown onSelect={setSelectedCategory} />
        </div>

        {selectedCategory ? (
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Current: {item.quantity} {item.unit} • Required: {item.normalRequiredStock} (Normal) / {item.busyRequiredStock} (Busy)
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Last stocktake: {format(new Date(item.lastStocktakeDate), 'PPP')}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          defaultValue={item.quantity}
                          onChange={(e) => handleCountChange(item.id, e.target.value, item)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-24 sm:text-sm border-gray-300 rounded-md"
                          placeholder="Count"
                        />
                        {savedStates[item.id] && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <textarea
                        rows={2}
                        value={notes[item.id] || ''}
                        onChange={(e) => handleNotesChange(item.id, e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Add notes..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
              <ClipboardCheck className="mx-auto h-12 w-12" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No category selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Please select a category to start stocktake
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stocktake;