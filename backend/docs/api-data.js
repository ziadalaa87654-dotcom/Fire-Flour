
const ENDPOINTS = [
  
  {
    id: 'health', group: 'Health', tag: 'health',
    groupDesc: 'Server status and database counts.',
    method: 'GET', path: '/api/health',
    summary: 'Health check — server status, uptime, and JSON DB record counts.',
    responses: [
      { status: 200, description: 'Server is up.', example: { success: true, status: 'ok', uptimeSeconds: 12, storage: 'backend/data/db.json', counts: { products: 30, users: 4, categories: 6, orders: 1 } } },
    ],
  },

  {
    id: 'auth-register', group: 'Auth', tag: 'auth',
    groupDesc: 'Register, login, and read the current user. Login/register return a Bearer token (HMAC-signed, 7-day expiry).',
    method: 'POST', path: '/api/auth/register',
    summary: 'Create a new Customer account.',
    bodyExample: { name: 'Emma Wilson', email: 'emma@example.com', password: 'password123' },
    bodyParams: [
      { name: 'name', type: 'string', required: true, description: 'Full name (2-50 characters).' },
      { name: 'email', type: 'string', required: true, description: 'Valid email address, must be unique.' },
      { name: 'password', type: 'string', required: true, description: 'Min 6 characters.' },
    ],
    responses: [
      { status: 201, description: 'Account created. Returns token + user.', example: { success: true, message: 'Account created.', token: '<header>.<payload>.<signature>', user: { id: 5, name: 'Emma Wilson', email: 'emma@example.com', role: 'Customer' } } },
      { status: 400, description: 'Validation failed (name/email/password rules).' },
      { status: 409, description: 'Email already registered.' },
    ],
  },
  {
    id: 'auth-login', group: 'Auth', tag: 'auth',
    method: 'POST', path: '/api/auth/login',
    summary: 'Log in and receive a Bearer token.',
    bodyExample: { email: 'admin@freshmart.com', password: 'password123' },
    bodyParams: [
      { name: 'email', type: 'string', required: true, description: 'Registered email address.' },
      { name: 'password', type: 'string', required: true, description: 'Account password.' },
    ],
    responses: [
      { status: 200, description: 'Logged in. Returns token + user.', example: { success: true, message: 'Logged in.', token: '<header>.<payload>.<signature>', user: { id: 1, name: 'Admin User', email: 'admin@freshmart.com', role: 'Admin' } } },
      { status: 401, description: 'Invalid email or password.' },
      { status: 403, description: 'Account suspended.' },
    ],
  },
  {
    id: 'auth-me', group: 'Auth', tag: 'auth',
    method: 'GET', path: '/api/auth/me', auth: 'Bearer',
    summary: 'Get the currently authenticated user.',
    responses: [
      { status: 200, description: 'Current user profile.', example: { success: true, user: { id: 1, name: 'Admin User', email: 'admin@freshmart.com', role: 'Admin', status: 'Active', joined: 'Aug 12, 2026', bio: 'FreshMart platform administrator.' } } },
      { status: 401, description: 'Missing/invalid token.' },
    ],
  },

  {
    id: 'products-list', group: 'Products', tag: 'products',
    groupDesc: 'Product catalog CRUD. Reads are public; create/update/delete require an Admin token. Powers Home, Shop, and ProductDetails pages.',
    method: 'GET', path: '/api/products',
    summary: 'List all products with search, category, and price filters.',
    params: [
      { name: 'q', type: 'string', required: false, in: 'query', description: 'Search name, description, category, tags.' },
      { name: 'category', type: 'string', required: false, in: 'query', description: 'Produce | Dairy | Bakery | Meat & Seafood | Pantry | Beverages | all' },
      { name: 'minPrice', type: 'number', required: false, in: 'query', description: 'Minimum price filter.' },
      { name: 'maxPrice', type: 'number', required: false, in: 'query', description: 'Maximum price filter.' },
      { name: 'inStock', type: 'boolean', required: false, in: 'query', description: 'If true, only return in-stock items.' },
    ],
    responses: [
      { status: 200, description: 'Full filtered product list.', example: { success: true, total: 30, products: [{ id: 1, name: 'Organic Baby Spinach', category: 'Produce', price: 3.99, stock: 150, unit: 'bag', rating: 4.7 }] } },
    ],
  },
  {
    id: 'products-get', group: 'Products', tag: 'products',
    method: 'GET', path: '/api/products/{id}',
    summary: 'Get one product by numeric id.',
    params: [{ name: 'id', type: 'integer', required: true, in: 'path', description: 'Product id, e.g. 1' }],
    responses: [
      { status: 200, description: 'Full product object.', example: { success: true, product: { id: 1, name: 'Organic Baby Spinach', description: 'Freshly harvested organic baby spinach leaves...', category: 'Produce', price: 3.99, stock: 150 } } },
      { status: 404, description: 'Product not found.' },
    ],
  },
  {
    id: 'products-create', group: 'Products', tag: 'products',
    method: 'POST', path: '/api/products', auth: 'Admin',
    summary: 'Create a product. Requires Admin role.',
    bodyExample: { name: 'Organic Quinoa', description: 'Pre-washed organic white quinoa. Complete protein, cooks in 15 minutes.', category: 'Pantry', price: 6.49, stock: 110, unit: 'bag', weight: '1 lb', tags: ['organic', 'protein', 'gluten-free'] },
    bodyParams: [
      { name: 'name', type: 'string', required: true, description: 'Product name.' },
      { name: 'description', type: 'string', required: false, description: 'Product description.' },
      { name: 'category', type: 'string', required: true, description: 'Must match a valid category.' },
      { name: 'price', type: 'number', required: true, description: 'Price in USD, min 0.' },
      { name: 'stock', type: 'integer', required: false, description: 'Stock quantity, default 0.' },
      { name: 'unit', type: 'string', required: false, description: 'e.g. bag, lb, oz, each.' },
      { name: 'weight', type: 'string', required: false, description: 'e.g. 1 lb, 500g.' },
      { name: 'tags', type: 'array', required: false, description: 'Array of tag strings.' },
    ],
    responses: [
      { status: 201, description: 'Created. Returns the new product (auto-incremented numeric id).', example: { success: true, message: 'Product created.', product: { id: 31, name: 'Organic Quinoa', status: 'available' } } },
      { status: 400, description: 'Validation errors array returned.' },
      { status: 401, description: 'Not authenticated.' },
      { status: 403, description: 'Not an Admin.' },
    ],
  },
  {
    id: 'products-update', group: 'Products', tag: 'products',
    method: 'PUT', path: '/api/products/{id}', auth: 'Admin',
    summary: 'Update any subset of product fields (partial update allowed).',
    params: [{ name: 'id', type: 'integer', required: true, in: 'path', description: 'Product id.' }],
    bodyExample: { price: 7.99, stock: 200 },
    bodyParams: [
      { name: 'name', type: 'string', required: false, description: 'New product name.' },
      { name: 'description', type: 'string', required: false, description: 'New description.' },
      { name: 'category', type: 'string', required: false, description: 'New category.' },
      { name: 'price', type: 'number', required: false, description: 'New price.' },
      { name: 'stock', type: 'integer', required: false, description: 'New stock level.' },
    ],
    responses: [
      { status: 200, description: 'Updated product returned.' },
      { status: 400, description: 'Validation errors.' },
      { status: 404, description: 'Product not found.' },
    ],
  },
  {
    id: 'products-delete', group: 'Products', tag: 'products',
    method: 'DELETE', path: '/api/products/{id}', auth: 'Admin',
    summary: 'Delete a product and remove it from existing orders.',
    params: [{ name: 'id', type: 'integer', required: true, in: 'path', description: 'Product id.' }],
    responses: [
      { status: 200, description: 'Deleted.', example: { success: true, message: "Product 'Organic Baby Spinach' deleted." } },
      { status: 404, description: 'Product not found.' },
    ],
  },

  {
    id: 'categories-list', group: 'Categories', tag: 'categories',
    groupDesc: 'Category cards shown on the Home page. Counts are computed live from the catalog.',
    method: 'GET', path: '/api/categories',
    summary: 'List categories with live product counts.',
    responses: [
      { status: 200, description: 'Category list.', example: { success: true, categories: [{ id: 'produce', title: 'Produce', count: 6, description: 'Fresh fruits, vegetables, and organic greens.' }, { id: 'dairy', title: 'Dairy', count: 5, description: 'Milk, cheese, yogurt, eggs, and butter.' }] } },
    ],
  },

  {
    id: 'orders-create', group: 'Orders', tag: 'orders',
    groupDesc: 'Per-user order records with status tracking. All endpoints require authentication. Powers My Orders, Checkout, and Order History.',
    method: 'POST', path: '/api/orders', auth: 'Bearer',
    summary: 'Place a new order with items and delivery address.',
    bodyExample: { items: [{ productId: 1, quantity: 2 }, { productId: 7, quantity: 1 }], address: '123 Main St, New York, NY 10001' },
    bodyParams: [
      { name: 'items', type: 'array', required: true, description: 'Array of { productId: number, quantity: number }. Must contain at least one item.' },
      { name: 'address', type: 'string', required: true, description: 'Full delivery address.' },
    ],
    responses: [
      { status: 201, description: 'Order placed. Returns order with computed totals.', example: { success: true, message: 'Order placed.', order: { id: 'o-abc123-x9y2', items: [{ productId: 1, name: 'Organic Baby Spinach', price: 3.99, quantity: 2 }], subtotal: 13.47, tax: 1.08, total: 14.55, status: 'pending' } } },
      { status: 400, description: 'Validation errors (empty items, invalid address, insufficient stock).' },
      { status: 404, description: 'Product not found.' },
    ],
  },
  {
    id: 'orders-mine', group: 'Orders', tag: 'orders',
    method: 'GET', path: '/api/orders/me', auth: 'Bearer',
    summary: "List the signed-in user's orders.",
    responses: [
      { status: 200, description: 'User orders.', example: { success: true, total: 1, orders: [{ id: 'o-1', items: [{ productId: 1, name: 'Organic Baby Spinach', price: 3.99, quantity: 2 }, { productId: 7, name: 'Fresh Whole Milk', price: 4.49, quantity: 1 }], subtotal: 17.76, tax: 1.42, total: 19.18, status: 'delivered', address: '123 Main St, Apt 4B, New York, NY 10001' }] } },
      { status: 401, description: 'Missing/invalid token.' },
    ],
  },
  {
    id: 'orders-list', group: 'Orders', tag: 'orders',
    method: 'GET', path: '/api/orders', auth: 'Admin',
    summary: 'Search/list all orders (Admin only).',
    params: [
      { name: 'q', type: 'string', required: false, in: 'query', description: 'Matches order id, address, or item names.' },
      { name: 'status', type: 'string', required: false, in: 'query', description: 'pending | confirmed | shipped | delivered | cancelled | all' },
    ],
    responses: [
      { status: 200, description: 'Matching orders.', example: { success: true, total: 1, orders: [{ id: 'o-1', userId: 3, total: 19.18, status: 'delivered' }] } },
      { status: 403, description: 'Admin role required.' },
    ],
  },
  {
    id: 'orders-update-status', group: 'Orders', tag: 'orders',
    method: 'PATCH', path: '/api/orders/{orderId}/status', auth: 'Bearer',
    summary: "Update an order's status. Customers can only cancel their own pending orders; Admin/Staff can update any order.",
    params: [{ name: 'orderId', type: 'string', required: true, in: 'path', description: 'Order id, e.g. o-1' }],
    bodyExample: { status: 'confirmed' },
    bodyParams: [
      { name: 'status', type: 'string', required: true, description: 'pending | confirmed | shipped | delivered | cancelled' },
    ],
    responses: [
      { status: 200, description: 'Status updated.' },
      { status: 400, description: 'Invalid status or order cannot be cancelled.' },
      { status: 403, description: "Customer trying to update another user's order." },
      { status: 404, description: 'Order not found.' },
    ],
  },
  {
    id: 'orders-delete', group: 'Orders', tag: 'orders',
    method: 'DELETE', path: '/api/orders/{orderId}', auth: 'Bearer',
    summary: 'Delete an order. Customers can only delete their own orders.',
    params: [{ name: 'orderId', type: 'string', required: true, in: 'path', description: 'Order id.' }],
    responses: [
      { status: 200, description: 'Deleted.' },
      { status: 403, description: "Customer trying to delete another user's order." },
      { status: 404, description: 'Order not found.' },
    ],
  },

  {
    id: 'users-update-me', group: 'Users', tag: 'users',
    groupDesc: 'Profile self-service plus admin user management.',
    method: 'PATCH', path: '/api/users/me', auth: 'Bearer',
    summary: 'Update my own profile (name / email / bio).',
    bodyExample: { name: 'Emma W.', email: 'emma@example.com', bio: 'Love organic food.' },
    bodyParams: [
      { name: 'name', type: 'string', required: false, description: 'New display name.' },
      { name: 'email', type: 'string', required: false, description: 'New email (must be unique).' },
      { name: 'bio', type: 'string', required: false, description: 'Profile bio text.' },
    ],
    responses: [
      { status: 200, description: 'Updated user returned (password never included).', example: { success: true, message: 'Profile updated.', user: { id: 3, name: 'Emma W.', email: 'emma@example.com' } } },
      { status: 400, description: 'Validation failed.' },
      { status: 409, description: 'Email already in use.' },
    ],
  },
  {
    id: 'users-list', group: 'Users', tag: 'users',
    method: 'GET', path: '/api/users', auth: 'Admin',
    summary: 'Search/list users.',
    params: [
      { name: 'q', type: 'string', required: false, in: 'query', description: 'Matches name or email (case-insensitive).' },
      { name: 'status', type: 'string', required: false, in: 'query', description: 'Active | Suspended | all' },
      { name: 'role', type: 'string', required: false, in: 'query', description: 'Admin | Staff | Customer | all' },
    ],
    responses: [
      { status: 200, description: 'Matching users (passwords stripped).', example: { success: true, total: 4, users: [{ id: 1, name: 'Admin User', email: 'admin@freshmart.com', role: 'Admin', status: 'Active', joined: 'Aug 12, 2026' }] } },
      { status: 403, description: 'Admin role required.' },
    ],
  },
  {
    id: 'users-create', group: 'Users', tag: 'users',
    method: 'POST', path: '/api/users', auth: 'Admin',
    summary: 'Create a user directly from admin panel (no password set).',
    bodyExample: { name: 'New Staff', email: 'staff@freshmart.com', role: 'Staff' },
    bodyParams: [
      { name: 'name', type: 'string', required: true, description: 'User full name.' },
      { name: 'email', type: 'string', required: true, description: 'Unique email address.' },
      { name: 'role', type: 'string', required: false, description: 'Admin | Staff | Customer (default: Customer).' },
    ],
    responses: [
      { status: 201, description: 'User created.' },
      { status: 409, description: 'Email already exists.' },
    ],
  },
  {
    id: 'users-toggle-status', group: 'Users', tag: 'users',
    method: 'PATCH', path: '/api/users/{id}/status', auth: 'Admin',
    summary: "Toggle Active/Suspended (or pass an explicit { status }).",
    params: [{ name: 'id', type: 'integer', required: true, in: 'path', description: 'User id, e.g. 4' }],
    bodyExample: {},
    bodyParams: [
      { name: 'status', type: 'string', required: false, description: 'Active | Suspended. If omitted, toggles current status.' },
    ],
    responses: [
      { status: 200, description: 'Status flipped and returned.', example: { success: true, message: 'User is now Suspended.', user: { id: 4, name: 'James Park', status: 'Suspended' } } },
      { status: 400, description: 'Cannot suspend your own account.' },
      { status: 404, description: 'User not found.' },
    ],
  },
  {
    id: 'users-set-role', group: 'Users', tag: 'users',
    method: 'PATCH', path: '/api/users/{id}/role', auth: 'Admin',
    summary: 'Change a user role (Admin | Staff | Customer).',
    params: [{ name: 'id', type: 'integer', required: true, in: 'path', description: 'User id.' }],
    bodyExample: { role: 'Staff' },
    bodyParams: [
      { name: 'role', type: 'string', required: true, description: 'Admin | Staff | Customer' },
    ],
    responses: [
      { status: 200, description: 'Role updated.' },
      { status: 400, description: 'Invalid role.' },
      { status: 404, description: 'User not found.' },
    ],
  },
  {
    id: 'users-delete', group: 'Users', tag: 'users',
    method: 'DELETE', path: '/api/users/{id}', auth: 'Admin',
    summary: 'Delete a user (cascade removes their orders). Cannot delete yourself.',
    params: [{ name: 'id', type: 'integer', required: true, in: 'path', description: 'User id.' }],
    responses: [
      { status: 200, description: 'Deleted.' },
      { status: 400, description: 'Cannot delete your own account.' },
      { status: 404, description: 'User not found.' },
    ],
  },

  {
    id: 'stats-me', group: 'Stats', tag: 'stats',
    groupDesc: 'Aggregates for Dashboard (customer) and Admin analytics screens.',
    method: 'GET', path: '/api/stats/me', auth: 'Bearer',
    summary: 'Customer dashboard KPIs for the signed-in user.',
    responses: [
      { status: 200, description: 'KPI values for StatCards.', example: { success: true, stats: { totalOrders: 3, totalSpent: 45.67, totalItems: 12, averageOrderValue: 15.22 } } },
      { status: 401, description: 'Authentication required.' },
    ],
  },
  {
    id: 'stats-admin', group: 'Stats', tag: 'stats',
    method: 'GET', path: '/api/stats/admin', auth: 'Admin',
    summary: 'Platform KPIs for the admin dashboard.',
    responses: [
      { status: 200, description: 'Platform totals.', example: { success: true, stats: { totalProducts: 30, totalUsers: 4, activeUsers: 3, totalOrders: 5, totalRevenue: 142.50, categoryPerformance: [{ title: 'Produce', count: 6 }] } } },
      { status: 403, description: 'Admin role required.' },
    ],
  },
];
