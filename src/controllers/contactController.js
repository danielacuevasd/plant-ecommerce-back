import { pool } from '../db/pool.js'
import { validarCorreo } from '../utils/validaciones.js'

// Convierte una fila de la base al formato que usa el front
function aMensaje(fila) {
  return {
    id: Number(fila.id),
    nombre: fila.nombre,
    correo: fila.correo,
    comentario: fila.comentario,
    fecha: fila.created_at,
  }
}

function validar(datos) {
  const errores = []
  const { nombre, correo, comentario } = datos

  if (typeof nombre !== 'string' || !nombre.trim() || nombre.length > 100) {
    errores.push('El nombre es obligatorio (máximo 100 caracteres)')
  }
  if (!validarCorreo(correo)) {
    errores.push('El correo no es válido (dominios permitidos: duoc.cl, profesor.duoc.cl y gmail.com)')
  }
  if (typeof comentario !== 'string' || !comentario.trim() || comentario.length > 500) {
    errores.push('El comentario es obligatorio (máximo 500 caracteres)')
  }
  return errores
}

export async function crear(req, res) {
  const datos = req.body ?? {}
  const errores = validar(datos)
  if (errores.length) return res.status(400).json({ mensaje: 'Datos inválidos', errores })

  const { rows } = await pool.query(
    `INSERT INTO contact_messages (nombre, correo, comentario)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [datos.nombre.trim(), datos.correo.trim(), datos.comentario.trim()]
  )
  res.status(201).json(aMensaje(rows[0]))
}

export async function listar(req, res) {
  const { rows } = await pool.query(
    'SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC'
  )
  res.json(rows.map(aMensaje))
}

export async function obtener(req, res) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensaje: 'El id debe ser un número entero positivo' })
  }

  const { rows } = await pool.query('SELECT * FROM contact_messages WHERE id = $1', [id])
  if (!rows.length) return res.status(404).json({ mensaje: 'Mensaje no encontrado' })
  res.json(aMensaje(rows[0]))
}