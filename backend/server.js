import app from './src/app.js'

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`FreshMart API running at http://localhost:${PORT}`)
  console.log(`API documentation:   http://localhost:${PORT}/docs`)
})
