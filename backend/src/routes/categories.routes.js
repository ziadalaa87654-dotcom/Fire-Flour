import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

router.get('/', (_req, res) => {
  const data = db.read()
  const categories = data.categories.map((category) => ({
    ...category,
    count: data.products.filter((p) => p.category === category.title).length,
  }))
  res.json({ success: true, categories })
})

export default router
