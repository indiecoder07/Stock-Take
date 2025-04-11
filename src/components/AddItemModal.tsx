import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useStore } from '../store';
import CategoryDropdown from './CategoryDropdown';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose }) => {
  const addItem = useStore((state) => state.addItem);
  const [formData, setFormData] = React.useState({
    name: '',
    categoryId: '',
    quantity: 0,
    unit: '',
    normalRequiredStock: 0,
    busyRequiredStock: 0,
    notes: '',
    minThreshold: 0,
    maxThreshold: 0,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.unit) newErrors.unit = 'Unit is required';
    if (formData.minThreshold < 0) newErrors.minThreshold = 'Min threshold must be positive';
    if (formData.maxThreshold <= formData.minThreshold) {
      newErrors.maxThreshold = 'Max threshold must be greater than min threshold';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await addItem({
          name: formData.name,
          category_id: formData.categoryId,
          quantity: formData.quantity,
          unit: formData.unit,
          normal_required_stock: formData.normalRequiredStock,
          busy_required_stock: formData.busyRequiredStock,
          notes: formData.notes,
          min_threshold: formData.minThreshold,
          max_threshold: formData.maxThreshold,
        });
        onClose();
        setFormData({
          name: '',
          categoryId: '',
          quantity: 0,
          unit: '',
          normalRequiredStock: 0,
          busyRequiredStock: 0,
          notes: '',
          minThreshold: 0,
          maxThreshold: 0,
        });
      } catch (error) {
        console.error('Failed to add item:', error);
        setErrors({ form: 'Failed to add item. Please try again.' });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes('quantity') || name.includes('Stock') || name.includes('Threshold')
          ? parseInt(value) || 0
          : value,
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-xl w-full bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-6 border-b">
            <Dialog.Title className="text-lg font-semibold">Add New Item</Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <CategoryDropdown onSelect={(id) => setFormData((prev) => ({ ...prev, categoryId: id }))} />
              {errors.categoryId && <p className="text-xs text-red-600">{errors.categoryId}</p>}
            </div>
            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Initial Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                    errors.unit ? 'border-red-500' : ''
                  }`}
                />
                {errors.unit && <p className="text-xs text-red-600">{errors.unit}</p>}
              </div>
            </div>
            {/* Required Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Normal Required Stock</label>
                <input
                  type="number"
                  name="normalRequiredStock"
                  value={formData.normalRequiredStock}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Busy Required Stock</label>
                <input
                  type="number"
                  name="busyRequiredStock"
                  value={formData.busyRequiredStock}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
            {/* Thresholds */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Threshold</label>
                <input
                  type="number"
                  name="minThreshold"
                  value={formData.minThreshold}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                {errors.minThreshold && <p className="text-xs text-red-600">{errors.minThreshold}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Threshold</label>
                <input
                  type="number"
                  name="maxThreshold"
                  value={formData.maxThreshold}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                {errors.maxThreshold && <p className="text-xs text-red-600">{errors.maxThreshold}</p>}
              </div>
            </div>
            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Additional details..."
              />
            </div>
            {/* Form-level error */}
            {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Item
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddItemModal;