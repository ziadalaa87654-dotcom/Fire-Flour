export function cors(req, res, next) {
  const origin = req.headers.origin || '*'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }
  next()
}

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` })
}

export function errorHandler(err, _req, res, _next) {
  console.error('[error]', err.message)
  const status = err.status || 500
  res.status(status).json({ success: false, message: err.message || 'Internal server error' })
}
