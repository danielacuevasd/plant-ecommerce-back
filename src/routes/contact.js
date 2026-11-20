import express from 'express'
import { crear, listar, obtener } from '../controllers/contactController.js'
import { verificarToken, requerirRol } from '../middleware/auth.js'

const router = express.Router()

router.post('/', (req, res) => {
  // #swagger.tags = ['Contacto']
  // #swagger.summary = 'Envía un mensaje de contacto'
  // #swagger.description = 'Es pública: cualquier visitante puede enviar un mensaje.'
  // #swagger.parameters['body'] = { in: 'body', description: 'Datos del mensaje', required: true, schema: { $nombre: 'Camila Reyes', $correo: 'camila@gmail.com', $comentario: 'Hola, quisiera saber si tienen Monstera en stock.' } }
  // #swagger.responses[201] = { description: 'Mensaje recibido' }
  // #swagger.responses[400] = { description: 'Datos inválidos' }
  return crear(req, res)
})

router.get('/', verificarToken, requerirRol('Administrador'), (req, res) => {
  // #swagger.tags = ['Contacto']
  // #swagger.summary = 'Lista los mensajes de contacto'
  // #swagger.description = 'Solo para administradores. Los más recientes primero.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[401] = { description: 'Token ausente, inválido o expirado' }
  // #swagger.responses[403] = { description: 'El usuario no es administrador' }
  return listar(req, res)
})

router.get('/:id', verificarToken, requerirRol('Administrador'), (req, res) => {
  // #swagger.tags = ['Contacto']
  // #swagger.summary = 'Obtiene un mensaje de contacto por id'
  // #swagger.description = 'Solo para administradores.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[401] = { description: 'Token ausente, inválido o expirado' }
  // #swagger.responses[403] = { description: 'El usuario no es administrador' }
  // #swagger.responses[404] = { description: 'Mensaje no encontrado' }
  return obtener(req, res)
})

export default router