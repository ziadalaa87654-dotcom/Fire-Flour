import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

router.post('/', requireAuth, (req, res) => {
  const { items, address } = req.body || {}
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'items array is required with at least one item.' })
  }
  if (!address || typeof address !== 'string' || address.trim().length < 5) {
    return res.status(400).json({ success: false, message: 'A valid delivery address is required.' })
  }

  const data = db.read()
  let subtotal = 0
  const orderItems = []

  for (const item of items) {
    const product = data.products.find((p) => p.id === Number(item.productId))
    if (!product) {
      return res.status(404).json({ success: false, message: `Product '${item.productId}' not found.` })
    }
    if (product.stock < (item.quantity || 1)) {
      return res.status(400).json({ success: false, message: `Insufficient stock for '${product.name}'. Available: ${product.stock}.` })
    }
    const qty = Number(item.quantity) || 1
    subtotal += product.price * qty
    orderItems.push({ productId: product.id, name: product.name, price: product.price, quantity: qty })
    product.stock -= qty
  }

  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100

  const order = {
    id: `o-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    userId: req.user.id,
    items: orderItems,
    subtotal: Math.round(subtotal * 100) / 100,
    tax,
    total,
    status: 'pending',
    address: address.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  data.orders.push(order)
  db.write(data)
  res.status(201).json({ success: true, message: 'Order placed.', order })
})

router.get('/me', requireAuth, (req, res) => {
  const data = db.read()
  const mine = data.orders.filter((o) => o.userId === req.user.id)
  res.json({
    success: true,
    total: mine.length,
    orders: mine,
  })
})

router.get('/', requireAdmin, (req, res) => {
  const data = db.read()
  const q = String(req.query.q || '').toLowerCase().trim()
  const status = req.query.status || 'all'

  let orders = data.orders
  if (q) {
    orders = orders.filter((o) =>
      `${o.id} ${o.address} ${o.items.map((i) => i.name).join(' ')}`.toLowerCase().includes(q)
    )
  }
  if (status !== 'all') orders = orders.filter((o) => o.status === status)

  res.json({ success: true, total: orders.length, orders })
})

router.patch('/:orderId/status', requireAuth, (req, res) => {
  const { status } = req.body || {}
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: `status must be one of: ${STATUSES.join(', ')}.` })
  }

  const data = db.read()
  const order = data.orders.find((o) => o.id === req.params.orderId)
  if (!order) return res.status(404).json({ success: false, message: `Order '${req.params.orderId}' not found.` })

  if (req.user.role === 'Customer' && order.userId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'You can only update your own orders.' })
  }

  if (status === 'cancelled' && order.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled.' })
  }

  order.status = status
  order.updatedAt = new Date().toISOString()
  db.write(data)
  res.json({ success: true, message: `Order status updated to '${status}'.`, order })
})

router.delete('/:orderId', requireAuth, (req, res) => {
  const data = db.read()
  const index = data.orders.findIndex((o) => o.id === req.params.orderId)
  if (index === -1) return res.status(404).json({ success: false, message: `Order '${req.params.orderId}' not found.` })

  const order = data.orders[index]
  if (req.user.role === 'Customer' && order.userId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'You can only cancel your own orders.' })
  }

  data.orders.splice(index, 1)
  db.write(data)
  res.json({ success: true, message: `Order '${req.params.orderId}' deleted.` })
})

export default router
