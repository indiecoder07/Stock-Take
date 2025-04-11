import React, { useState } from 'react';
import { addItem } from '../store/actions';

interface AddItemModalProps {
  onClose: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!formData.unit) newErrors.unit = 'Unit is required';
    if (formData.normalRequiredStock < 0) newErrors.normalRequiredStock = 'Normal required stock cannot be negative';
    if (formData.busyRequiredStock < 0) newErrors.busyRequiredStock = 'Busy required stock cannot be negative';
    if (formData.minThreshold < 0) newErrors.minThreshold = 'Minimum threshold cannot be negative';
    if (formData.maxThreshold < 0) newErrors.maxThreshold = 'Maximum threshold cannot be negative';

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
        setErrors({ form: (error as Error).message || 'Failed to add item. Please try again.' });
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <span>{errors.name}</span>}
        </div>
        <div>
          <label>Category</label>
          <input
            type="text"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          />
          {errors.categoryId && <span>{errors.categoryId}</span>}
        </div>
        <div>
          <label>Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) })}
          />
          {errors.quantity && <span>{errors.quantity}</span>}
        </div>
        <div>
          <label>Unit</label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          />
          {errors.unit && <span>{errors.unit}</span>}
        </div>
        <div>
          <label>Normal Required Stock</label>
          <input
            type="number"
            value={formData.normalRequiredStock}
            onChange={(e) =>
              setFormData({ ...formData, normalRequiredStock: parseInt(e.target.value, 10) })
            }
          />
          {errors.normalRequiredStock && <span>{errors.normalRequiredStock}</span>}
        </div>
        <div>
          <label>Busy Required Stock</label>
          <input
            type="number"
            value={formData.busyRequiredStock}
            onChange={(e) =>
              setFormData({ ...formData, busyRequiredStock: parseInt(e.target.value, 10) })
            }
          />
          {errors.busyRequiredStock && <span>{errors.busyRequiredStock}</span>}
        </div>
        <div>
          <label>Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
        <div>
          <label>Minimum Threshold</label>
          <input
            type="number"
            value={formData.minThreshold}
            onChange={(e) =>
              setFormData({ ...formData, minThreshold: parseInt(e.target.value, 10) })
            }
          />
          {errors.minThreshold && <span>{errors.minThreshold}</span>}
        </div>
        <div>
          <label>Maximum Threshold</label>
          <input
            type="number"
            value={formData.maxThreshold}
            onChange={(e) =>
              setFormData({ ...formData, maxThreshold: parseInt(e.target.value, 10) })
            }
          />
          {errors.maxThreshold && <span>{errors.maxThreshold}</span>}
        </div>
        {errors.form && <span>{errors.form}</span>}
        <button type="submit">Add Item</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AddItemModal;