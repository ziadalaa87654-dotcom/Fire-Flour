import { Router } from 'express'
import { db } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

const CATEGORIES = ['Produce', 'Dairy', 'Bakery', 'Meat & Seafood', 'Pantry', 'Beverages']
const UNITS = ['piece', 'lb', 'kg', 'bag', 'box', 'pack', 'bottle', 'can', 'jar', 'gallon', 'pint', 'dozen', 'fillet', 'tub', 'block', 'shaker', 'tin', 'loaf']

function validateProductPayload(body, { partial = false } = {}) {
  const errors = []
  if (!partial || body.name !== undefined) {
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.push('name is required (min 2 characters).')
    }
  }
  if (!partial || body.description !== undefined) {
    if (!body.description || typeof body.description !== 'string' || body.description.trim().length < 10) {
      errors.push('description is required (min 10 characters).')
    }
  }
  if (!partial || body.category !== undefined) {
    if (body.category && !CATEGORIES.includes(body.category)) errors.push(`category must be one of: ${CATEGORIES.join(', ')}.`)
  }
  if (body.price !== undefined && body.price !== '' && (Number.isNaN(Number(body.price)) || Number(body.price) < 0)) {
    errors.push('price must be a non-negative number.')
  }
  if (body.stock !== undefined && body.stock !== '' && (Number.isNaN(Number(body.stock)) || Number(body.stock) < 0)) {
    errors.push('stock must be a non-negative number.')
  }
  if (body.unit && !UNITS.includes(body.unit)) errors.push(`unit must be one of: ${UNITS.join(', ')}.`)
  return errors
}

router.get('/', (req, res) => {
  const data = db.read()
  const q = String(req.query.q || '').toLowerCase().trim()
  const category = req.query.category || 'all'
  const minPrice = req.query.minPrice !== undefined ? Number(req.query.minPrice) : null
  const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : null
  const inStock = req.query.inStock

  const filtered = data.products.filter((p) => {
    const matchesQuery =
      !q ||
      `${p.name} ${p.description} ${p.category} ${(p.tags || []).join(' ')}`.toLowerCase().includes(q)
    const matchesCategory = category === 'all' || p.category === category
    const matchesMinPrice = minPrice === null || p.price >= minPrice
    const matchesMaxPrice = maxPrice === null || p.price <= maxPrice
    const matchesStock = inStock !== 'true' || p.stock > 0
    return matchesQuery && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesStock
  })

  res.json({
    success: true,
    total: filtered.length,
    products: filtered,
  })
})

router.post('/', requireAdmin, (req, res) => {
  const errors = validateProductPayload(req.body || {})
  if (errors.length) return res.status(400).json({ success: false, message: errors.join(' '), errors })

  const data = db.read()
  const now = new Date().toISOString()

  const p = {
    id: db.nextId('products'),
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    category: req.body.category || 'Produce',
    price: Number(req.body.price) || 0,
    stock: Number(req.body.stock) || 0,
    unit: req.body.unit || 'piece',
    weight: req.body.weight || '',
    rating: 0,
    reviews: 0,
    status: req.body.status || 'available',
    image: req.body.image || '',
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    createdAt: now,
    updatedAt: now,
  }
  data.products.push(p)
  db.write(data)
  res.status(201).json({ success: true, message: 'Product created.', product: p })
})

router.get('/:id', (req, res) => {
  const data = db.read()
  const id = Number(req.params.id)
  const p = data.products.find((item) => item.id === id)
  if (!p) return res.status(404).json({ success: false, message: `Product '${req.params.id}' not found.` })
  res.json({ success: true, product: p })
})

router.put('/:id', requireAdmin, (req, res) => {
  const data = db.read()
  const id = Number(req.params.id)
  const p = data.products.find((item) => item.id === id)
  if (!p) return res.status(404).json({ success: false, message: `Product '${req.params.id}' not found.` })

  const errors = validateProductPayload(req.body || {}, { partial: true })
  if (errors.length) return res.status(400).json({ success: false, message: errors.join(' '), errors })

  const allowed = ['name', 'description', 'category', 'price', 'stock', 'unit', 'weight', 'status', 'image', 'tags']
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      if (key === 'price' || key === 'stock') {
        p[key] = req.body[key] === '' ? 0 : Number(req.body[key])
      } else {
        p[key] = req.body[key]
      }
    }
  }
  p.updatedAt = new Date().toISOString()
  db.write(data)
  res.json({ success: true, message: 'Product updated.', product: p })
})

router.delete('/:id', requireAdmin, (req, res) => {
  const data = db.read()
  const id = Number(req.params.id)
  const index = data.products.findIndex((item) => item.id === id)
  if (index === -1) return res.status(404).json({ success: false, message: `Product '${req.params.id}' not found.` })

  const [removed] = data.products.splice(index, 1)
  data.orders.forEach((order) => {
    order.items = order.items.filter((item) => item.productId !== removed.id)
  })
  db.write(data)
  res.json({ success: true, message: `Product '${removed.name}' deleted.` })
})

export default router
