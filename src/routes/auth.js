import express from 'express'
import { registrar, login, perfil } from '../controllers/authController.js'
import { verificarToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', (req, res) => {
  // #swagger.tags = ['Autenticación']
  // #swagger.summary = 'Registra un cliente nuevo'
  // #swagger.description = 'Crea un usuario de tipo Cliente y devuelve un token JWT (el usuario inicia sesión automáticamente).'
  // #swagger.parameters['body'] = { in: 'body', description: 'Datos del registro', required: true, schema: { $run: '191102207', $nombre: 'Camila', $apellidos: 'Reyes Soto', $correo: 'camila@gmail.com', $contrasena: 'clave123', $region: 'Región Metropolitana de Santiago', $comuna: 'Santiago', $direccion: 'Av. Siempre Viva 123, Santiago', fechaNacimiento: '1998-05-20' } }
  // #swagger.responses[201] = { description: 'Usuario creado, devuelve token y usuario' }
  // #swagger.responses[400] = { description: 'Datos inválidos' }
  // #swagger.responses[409] = { description: 'El correo o el RUN ya están registrados' }
  return registrar(req, res)
})

router.post('/login', (req, res) => {
  // #swagger.tags = ['Autenticación']
  // #swagger.summary = 'Inicia sesión'
  // #swagger.description = 'Valida las credenciales y devuelve un token JWT. Úsalo en el botón Authorize como: Bearer <token>'
  // #swagger.parameters['body'] = { in: 'body', description: 'Credenciales', required: true, schema: { $correo: 'marcelo.caceres@profesor.duoc.cl', $contrasena: 'admin' } }
  // #swagger.responses[200] = { description: 'Devuelve token y usuario' }
  // #swagger.responses[401] = { description: 'Credenciales incorrectas' }
  return login(req, res)
})

router.get('/me', verificarToken, (req, res) => {
  // #swagger.tags = ['Autenticación']
  // #swagger.summary = 'Datos del usuario con sesión iniciada'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[401] = { description: 'Token ausente, inválido o expirado' }
  return perfil(req, res)
})

export default router