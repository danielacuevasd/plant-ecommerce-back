import express from 'express'
import { listar, obtener, crear, actualizar, eliminar } from '../controllers/productsController.js'

const router = express.Router()

router.get('/', (req, res) => {
  // #swagger.tags = ['Productos']
  // #swagger.summary = 'Lista los productos'
  // #swagger.description = 'Devuelve todos los productos. Se puede filtrar por categoría.'
  // #swagger.parameters['categoria'] = { in: 'query', description: 'interior, exterior, macetas, sustratos o herramientas', type: 'string' }
  return listar(req, res)
})

router.get('/:id', (req, res) => {
  // #swagger.tags = ['Productos']
  // #swagger.summary = 'Obtiene un producto por id'
  // #swagger.responses[404] = { description: 'Producto no encontrado' }
  return obtener(req, res)
})

router.post('/', (req, res) => {
  // #swagger.tags = ['Productos']
  // #swagger.summary = 'Crea un producto'
  // #swagger.parameters['body'] = { in: 'body', description: 'Datos del producto', required: true, schema: { $codigo: 'PL-009', $nombre: 'Helecho Boston', $categoria: 'interior', $precio: 9990, $stock: 10, stockCritico: 2, descripcionCorta: 'Helecho de hojas largas, ideal para colgar.', descripcion: 'Prefiere ambientes húmedos y luz indirecta.', imagen: '/img/logo.png' } }
  // #swagger.responses[201] = { description: 'Producto creado' }
  // #swagger.responses[400] = { description: 'Datos inválidos' }
  // #swagger.responses[409] = { description: 'El código ya existe' }
  return crear(req, res)
})

router.put('/:id', (req, res) => {
  // #swagger.tags = ['Productos']
  // #swagger.summary = 'Actualiza un producto'
  // #swagger.parameters['body'] = { in: 'body', description: 'Datos del producto', required: true, schema: { $codigo: 'PL-009', $nombre: 'Helecho Boston', $categoria: 'interior', $precio: 9990, $stock: 10, stockCritico: 2, descripcionCorta: 'Helecho de hojas largas, ideal para colgar.', descripcion: 'Prefiere ambientes húmedos y luz indirecta.', imagen: '/img/logo.png' } }
  // #swagger.responses[404] = { description: 'Producto no encontrado' }
  return actualizar(req, res)
})

router.delete('/:id', (req, res) => {
  // #swagger.tags = ['Productos']
  // #swagger.summary = 'Elimina un producto'
  // #swagger.responses[404] = { description: 'Producto no encontrado' }
  return eliminar(req, res)
})

export default router