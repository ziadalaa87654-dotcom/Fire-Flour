import React, { useEffect, useState, useMemo } from 'react';
import productService from '../../services/productService';
import ProductModal from './ProductModal';
import { useApp } from '../../context/AppContext';

export default function Products() {
  const { showToast } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      showToast('Failed to fetch products', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const text = `${p.name} ${p.desc} ${p.category} ${p.price}`.toLowerCase();
      const matchesSearch = !searchQuery || text.includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await productService.deleteProduct(product.id);
        showToast(`Deleted "${product.name}"`, 'success');
        fetchProducts();
      } catch (err) {
        showToast('Failed to delete product', 'danger');
      }
    }
  };

  return (
    <div>
      {}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold font-serif mb-1" style={{ color: '#171714' }}>Product Management</h2>
          <p className="text-muted small mb-0">Create, edit, update, or remove menu items</p>
        </div>
        <button className="btn btn-danger px-4 fw-bold shadow-sm" onClick={handleCreate}>
          + Add New Product
        </button>
      </div>

      {}
      <div className="card border-0 shadow-sm p-3 mb-4" style={{ background: '#fff', borderRadius: '12px' }}>
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="btn-group w-100" role="group">
              {['all', 'pizza', 'pasta', 'salad', 'dessert'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm text-capitalize ${activeCategory === cat ? 'btn-danger fw-bold' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search products by name or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {}
      <div className="card border-0 shadow-sm" style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="mb-0">No products found matching your search criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th style={{ width: '60px' }}>Item</th>
                  <th>Name & Details</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={p.image || 'https://via.placeholder.com/48'}
                        alt={p.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{p.name}</div>
                      <div className="text-muted small text-truncate" style={{ maxWidth: '340px', fontSize: '12px' }}>
                        {p.desc}
                      </div>
                    </td>
                    <td>
                      <span className={`badge text-uppercase ${
                        p.category === 'pizza' ? 'bg-danger' :
                        p.category === 'pasta' ? 'bg-warning text-dark' :
                        p.category === 'salad' ? 'bg-success' : 'bg-info text-dark'
                      }`} style={{ fontSize: '10px' }}>
                        {p.category}
                      </span>
                    </td>
                    <td className="fw-bold text-danger">€{Number(p.price).toFixed(2)}</td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-outline-dark me-2"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(p)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {}
      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchProducts}
      />
    </div>
  );
}
