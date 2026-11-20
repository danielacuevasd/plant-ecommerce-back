import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import swaggerUi from 'swagger-ui-express'
import { pool } from './db/pool.js'
import authRouter from './routes/auth.js'
import productsRouter from './routes/products.js'
import contactRouter from './routes/contact.js'

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN }))
app.use(express.json())

app.use('/auth', authRouter)
app.use('/products', productsRouter)
app.use('/contact', contactRouter)

// Documentacion generada por swagger.js
const swaggerFile = JSON.parse(readFileSync('./swagger-output.json'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Verifica que la API y la base de datos respondan
app.get('/health', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT now() AS ahora')
    res.json({ estado: 'ok', baseDeDatos: 'conectada', ahora: rows[0].ahora })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ estado: 'error', baseDeDatos: 'sin conexion' })
  }
})

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' })
})

// Errores no controlados
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' })
  }
  console.error(err.message)
  res.status(500).json({ mensaje: 'Error interno del servidor' })
})

export default app