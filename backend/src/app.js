import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { db } from './db.js'
import { attachUser } from './middleware/auth.js'
import { cors, errorHandler, notFound } from './middleware/common.js'
import authRoutes from './routes/auth.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import productsRoutes from './routes/products.routes.js'
import ordersRoutes from './routes/orders.routes.js'
import usersRoutes from './routes/users.routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.set('db', db)
app.disable('x-powered-by')

app.use(cors)
app.use(express.json({ limit: '1mb' }))
app.use(attachUser)

app.use((req, _res, next) => {
  if (req.path.startsWith('/api')) console.log(`${req.method} ${req.originalUrl}`)
  next()
})

app.get('/api/health', (_req, res) => {
  const data = db.read()
  res.json({
    success: true,
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    storage: db.filePath,
    counts: {
      products: data.products.length,
      users: data.users.length,
      categories: data.categories.length,
      orders: data.orders.length,
    },
  })
})

app.get('/api/stats/me', (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required.' })
  const data = db.read()
  const myOrders = data.orders.filter((o) => o.userId === req.user.id)
  const totalSpent = myOrders.reduce((sum, o) => sum + o.total, 0)
  const totalItems = myOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)
  res.json({
    success: true,
    stats: {
      totalOrders: myOrders.length,
      totalSpent: Math.round(totalSpent * 100) / 100,
      totalItems,
      averageOrderValue: myOrders.length ? Math.round((totalSpent / myOrders.length) * 100) / 100 : 0,
    },
  })
})

app.get('/api/stats/admin', (req, res) => {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({ success: false, message: 'Admin role required.' })
  }
  const data = db.read()
  const totalRevenue = data.orders.reduce((sum, o) => sum + o.total, 0)
  res.json({
    success: true,
    stats: {
      totalProducts: data.products.length,
      totalUsers: data.users.length,
      activeUsers: data.users.filter((u) => u.status === 'Active').length,
      totalOrders: data.orders.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      categoryPerformance: data.categories.map((c) => ({
        title: c.title,
        count: data.products.filter((p) => p.category === c.title).length,
      })),
    },
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/products', productsRoutes)

app.use('/docs', express.static(path.join(__dirname, '..', 'docs'), { index: 'api-docs.html' }))
app.get('/', (_req, res) => {
  res.redirect('/docs')
})

app.use(notFound)
app.use(errorHandler)

export default app
