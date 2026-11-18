import 'dotenv/config'
import app from './app.js'

// Sin secreto no se pueden firmar ni validar los tokens
if (!process.env.JWT_SECRET) {
  console.error('Falta la variable JWT_SECRET en el archivo .env')
  process.exit(1)
}

const PORT = process.env.PORT || 3000

app.listen(PORT, (err) => {
  if (err) {
    console.error('No se pudo iniciar el servidor:', err.message)
    process.exit(1)
  }
  console.log(`API escuchando en http://localhost:${PORT}`)
})