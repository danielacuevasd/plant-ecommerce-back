import 'dotenv/config'
import app from './app.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, (err) => {
  if (err) {
    console.error('No se pudo iniciar el servidor:', err.message)
    process.exit(1)
  }
  console.log(`API escuchando en http://localhost:${PORT}`)
})