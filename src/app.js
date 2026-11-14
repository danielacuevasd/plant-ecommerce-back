import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import swaggerUi from 'swagger-ui-express'
import { pool } from './db/pool.js'
import usersRouter from './routes/users.js'

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN }))
app.use(express.json())

app.use('/users', usersRouter)

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

export default app