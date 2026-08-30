import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { useApp } from '../../context/AppContext';

export default function ProductModal({ product, isOpen, onClose, onSave }) {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('pizza');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || 'pizza');
      setPrice(product.price || '');
      setDesc(product.desc || '');
      setImage(product.image || '');
    } else {
      setName('');
      setCategory('pizza');
      setPrice('');
      setDesc('');
      setImage('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80');
    }
    setError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      setError('Please fill in required fields (Name & Price)');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      name: name.trim(),
      category,
      price: Number(price),
      desc: desc.trim(),
      image: image.trim() || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    };

    try {
      if (isEditing) {
        await productService.updateProduct(product.id, payload);
        showToast('Product updated successfully!', 'success');
      } else {
        await productService.createProduct(payload);
        showToast('New product created!', 'success');
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: 1055 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px', background: '#faf8f3' }}>
          
          <div className="modal-header border-bottom-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h4 className="modal-title font-serif fw-bold" style={{ color: '#171714' }}>
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h4>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body p-4">
            {error && (
              <div className="alert alert-danger py-2 px-3 mb-3 small border-0" style={{ borderRadius: '6px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">Product Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Quattro Formaggi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted mb-1">Category *</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="pizza">Pizza</option>
                    <option value="pasta">Pasta</option>
                    <option value="salad">Salad</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted mb-1">Price (€) *</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    placeholder="15.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">Description / Ingredients</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="San Marzano tomato, fior di latte, fresh basil..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger px-4 fw-bold" disabled={loading}>
                  {loading ? 'Saving...' : isEditing ? 'Update Dish' : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
