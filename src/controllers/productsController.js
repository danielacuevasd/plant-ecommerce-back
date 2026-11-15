import { pool } from '../db/pool.js'

const CATEGORIAS = ['interior', 'exterior', 'macetas', 'sustratos', 'herramientas']

// Convierte una fila de la base al formato que usa el front (camelCase)
function aProducto(fila) {
  return {
    id: Number(fila.id),
    codigo: fila.codigo,
    nombre: fila.nombre,
    categoria: fila.categoria,
    precio: fila.precio,
    stock: fila.stock,
    stockCritico: fila.stock_critico ?? 0,
    descripcionCorta: fila.descripcion_corta ?? '',
    descripcion: fila.descripcion ?? '',
    imagen: fila.imagen ?? '/img/logo.png',
  }
}

// Devuelve el id como numero, o null si no es valido
function leerId(valor) {
  const id = Number(valor)
  return Number.isInteger(id) && id > 0 ? id : null
}

// Valida los datos de un producto y devuelve la lista de errores
function validar(datos) {
  const errores = []
  const { codigo, nombre, descripcion, descripcionCorta, categoria, precio, stock, stockCritico } = datos

  if (typeof codigo !== 'string' || codigo.trim().length < 3 || codigo.trim().length > 50) {
    errores.push('El código es obligatorio (entre 3 y 50 caracteres)')
  }
  if (typeof nombre !== 'string' || !nombre.trim() || nombre.length > 100) {
    errores.push('El nombre es obligatorio (máximo 100 caracteres)')
  }
  if (descripcion !== undefined && (typeof descripcion !== 'string' || descripcion.length > 500)) {
    errores.push('La descripción no puede superar los 500 caracteres')
  }
  if (descripcionCorta !== undefined && (typeof descripcionCorta !== 'string' || descripcionCorta.length > 100)) {
    errores.push('La descripción corta no puede superar los 100 caracteres')
  }
  if (!CATEGORIAS.includes(categoria)) {
    errores.push(`La categoría debe ser una de: ${CATEGORIAS.join(', ')}`)
  }
  if (!Number.isInteger(precio) || precio < 0) {
    errores.push('El precio debe ser un número entero mayor o igual a 0')
  }
  if (!Number.isInteger(stock) || stock < 0) {
    errores.push('El stock debe ser un número entero mayor o igual a 0')
  }
  if (stockCritico !== undefined && (!Number.isInteger(stockCritico) || stockCritico < 0)) {
    errores.push('El stock crítico debe ser un número entero mayor o igual a 0')
  }
  return errores
}

export async function listar(req, res) {
  const { categoria } = req.query
  const resultado = categoria
    ? await pool.query('SELECT * FROM products WHERE categoria = $1 ORDER BY id', [categoria])
    : await pool.query('SELECT * FROM products ORDER BY id')
  res.json(resultado.rows.map(aProducto))
}

export async function obtener(req, res) {
  const id = leerId(req.params.id)
  if (!id) return res.status(400).json({ mensaje: 'El id debe ser un número entero positivo' })

  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id])
  if (!rows.length) return res.status(404).json({ mensaje: 'Producto no encontrado' })
  res.json(aProducto(rows[0]))
}

export async function crear(req, res) {
  const datos = req.body ?? {}
  const errores = validar(datos)
  if (errores.length) return res.status(400).json({ mensaje: 'Datos inválidos', errores })

  const descripcion = datos.descripcion ?? ''
  const descripcionCorta = datos.descripcionCorta ?? descripcion.slice(0, 80)

  try {
    const { rows } = await pool.query(
      `INSERT INTO products
         (codigo, nombre, descripcion_corta, descripcion, categoria, precio, stock, stock_critico, imagen)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        datos.codigo.trim(), datos.nombre.trim(), descripcionCorta, descripcion,
        datos.categoria, datos.precio, datos.stock,
        datos.stockCritico ?? 0, datos.imagen ?? '/img/logo.png',
      ]
    )
    res.status(201).json(aProducto(rows[0]))
  } catch (err) {
    // 23505: violacion de unicidad (codigo repetido)
    if (err.code === '23505') {
      return res.status(409).json({ mensaje: 'Ya existe un producto con ese código' })
    }
    throw err
  }
}

export async function actualizar(req, res) {
  const id = leerId(req.params.id)
  if (!id) return res.status(400).json({ mensaje: 'El id debe ser un número entero positivo' })

  const datos = req.body ?? {}
  const errores = validar(datos)
  if (errores.length) return res.status(400).json({ mensaje: 'Datos inválidos', errores })

  try {
    // Los campos opcionales que no se envian conservan su valor actual
    const { rows } = await pool.query(
      `UPDATE products SET
         codigo = $1, nombre = $2, categoria = $3, precio = $4, stock = $5,
         descripcion = COALESCE($6, descripcion),
         descripcion_corta = COALESCE($7, descripcion_corta),
         stock_critico = COALESCE($8, stock_critico),
         imagen = COALESCE($9, imagen)
       WHERE id = $10
       RETURNING *`,
      [
        datos.codigo.trim(), datos.nombre.trim(), datos.categoria, datos.precio, datos.stock,
        datos.descripcion ?? null, datos.descripcionCorta ?? null,
        datos.stockCritico ?? null, datos.imagen ?? null, id,
      ]
    )
    if (!rows.length) return res.status(404).json({ mensaje: 'Producto no encontrado' })
    res.json(aProducto(rows[0]))
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ mensaje: 'Ya existe un producto con ese código' })
    }
    throw err
  }
}

export async function eliminar(req, res) {
  const id = leerId(req.params.id)
  if (!id) return res.status(400).json({ mensaje: 'El id debe ser un número entero positivo' })

  const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id])
  if (!rows.length) return res.status(404).json({ mensaje: 'Producto no encontrado' })
  res.json({ mensaje: 'Producto eliminado' })
}