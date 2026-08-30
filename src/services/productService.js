import { apiRequest } from './apiClient';

const PRODUCTS_STORAGE_KEY = 'fire_flour_mock_products';

const INITIAL_PRODUCTS = [
  { id: 1, category: 'pizza', name: 'Margherita', desc: 'San Marzano tomato, fior di latte, basil, olive oil', price: 14, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80' },
  { id: 2, category: 'pizza', name: 'Diavola', desc: 'Tomato, mozzarella, spicy salami, chilli, basil', price: 17, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80' },
  { id: 3, category: 'pizza', name: 'Prosciutto e Burrata', desc: 'Tomato, mozzarella, prosciutto, creamy burrata, rocket', price: 19, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
  { id: 4, category: 'pizza', name: 'Funghi', desc: 'Mozzarella, wild mushrooms, thyme, parmesan', price: 16, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80' },
  { id: 5, category: 'pasta', name: 'Truffle Tagliatelle', desc: 'Fresh pasta, parmesan cream, black truffle', price: 19, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80' },
  { id: 6, category: 'pasta', name: 'Arrabbiata', desc: 'Rigatoni, tomato, garlic, chilli, parsley', price: 15, image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=600&q=80' },
  { id: 7, category: 'salad', name: 'Italian Garden', desc: 'Rocket, cherry tomato, burrata, pesto, balsamic', price: 12, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80' },
  { id: 8, category: 'salad', name: 'Caprese', desc: 'Heirloom tomatoes, mozzarella, basil, olive oil', price: 13, image: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&w=600&q=80' },
  { id: 9, category: 'dessert', name: 'Tiramisu', desc: 'Mascarpone, espresso, cocoa, ladyfingers', price: 9, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80' },
  { id: 10, category: 'dessert', name: 'Panna Cotta', desc: 'Vanilla cream, seasonal berries, citrus', price: 8, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80' },
];

function normalizeProduct(p) {
  if (!p) return null;
  return {
    ...p,
    id: p.id,
    name: p.name || 'Untitled Dish',
    desc: p.description || p.desc || 'Handcrafted fresh item.',
    description: p.description || p.desc || 'Handcrafted fresh item.',
    category: (p.category || 'pizza').toLowerCase(),
    price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
    image: p.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
  };
}

function getStoredProducts() {
  const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
}

function saveStoredProducts(products) {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

export const productService = {
  async getProducts() {
    try {
      const data = await apiRequest('/products', 'GET');
      const list = data.products || (Array.isArray(data) ? data : []);
      if (Array.isArray(list) && list.length > 0) {
        return list.map(normalizeProduct);
      }
    } catch (err) {
      
    }
    return getStoredProducts().map(normalizeProduct);
  },

  async getProductById(id) {
    try {
      const data = await apiRequest(`/products/${id}`, 'GET');
      if (data.product) return normalizeProduct(data.product);
    } catch (err) {
      
    }
    const products = getStoredProducts();
    const match = products.find((p) => String(p.id) === String(id));
    return match ? normalizeProduct(match) : null;
  },

  async createProduct(productData) {
    const description = (productData.desc || productData.description || 'Authentic Neapolitan artisanal dish made fresh to order.').trim();
    const payload = {
      name: productData.name,
      description: description.length >= 10 ? description : `${description} (Freshly prepared in our wood-fired oven)`,
      category: (productData.category || 'pizza').toLowerCase(),
      price: Number(productData.price) || 0,
      stock: 50,
      image: productData.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    };

    try {
      const data = await apiRequest('/products', 'POST', payload);
      if (data.product) {
        return normalizeProduct(data.product);
      }
    } catch (err) {
      if (!err.isNetworkError && err.status >= 400) {
        throw new Error(err.message || 'Failed to create product on backend server');
      }
    }

    const products = getStoredProducts();
    const newProduct = normalizeProduct({
      id: Date.now(),
      ...payload,
      desc: payload.description,
    });
    products.unshift(newProduct);
    saveStoredProducts(products);
    return newProduct;
  },

  async updateProduct(id, productData) {
    const description = (productData.desc || productData.description || 'Authentic Neapolitan artisanal dish made fresh to order.').trim();
    const payload = {
      name: productData.name,
      description: description.length >= 10 ? description : `${description} (Freshly prepared in our wood-fired oven)`,
      category: (productData.category || 'pizza').toLowerCase(),
      price: Number(productData.price) || 0,
      stock: 50,
      image: productData.image || '',
    };

    try {
      const data = await apiRequest(`/products/${id}`, 'PUT', payload);
      if (data.product) {
        return normalizeProduct(data.product);
      }
    } catch (err) {
      if (!err.isNetworkError && err.status >= 400) {
        throw new Error(err.message || 'Failed to update product on backend server');
      }
    }

    const products = getStoredProducts();
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index === -1) throw new Error('Product not found');

    products[index] = normalizeProduct({
      ...products[index],
      ...payload,
      desc: payload.description,
    });
    saveStoredProducts(products);
    return products[index];
  },

  async deleteProduct(id) {
    try {
      await apiRequest(`/products/${id}`, 'DELETE');
      return true;
    } catch (err) {
      if (!err.isNetworkError && err.status >= 400) {
        throw new Error(err.message || 'Failed to delete product on backend server');
      }
    }

    const products = getStoredProducts();
    const filtered = products.filter((p) => String(p.id) !== String(id));
    saveStoredProducts(filtered);
    return true;
  },
};

export default productService;
