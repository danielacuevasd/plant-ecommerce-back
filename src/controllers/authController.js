import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db/pool.js'
import { validarRun, validarCorreo } from '../utils/validaciones.js'

// Se compara contra este hash cuando el correo no existe, para que
// la respuesta tarde lo mismo y no revele que correos estan registrados
const HASH_FALSO = bcrypt.hashSync('contrasena-inexistente', 10)

function generarToken(usuario) {
  return jwt.sign(
    { correo: usuario.correo, tipo: usuario.tipo },
    process.env.JWT_SECRET,
    { subject: String(usuario.id), expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  )
}

// Datos del usuario que se devuelven al front (nunca la contrasena)
function aUsuario(fila) {
  return { id: Number(fila.id), nombre: fila.nombre, correo: fila.correo, tipo: fila.tipo }
}

function validarRegistro(datos) {
  const errores = []
  const { run, nombre, apellidos, correo, contrasena, fechaNacimiento, region, comuna, direccion } = datos

  if (!validarRun(run)) errores.push('El RUN no es válido (7 a 9 caracteres, sin puntos ni guion, con dígito verificador correcto)')
  if (typeof nombre !== 'string' || !nombre.trim() || nombre.length > 50) errores.push('El nombre es obligatorio (máximo 50 caracteres)')
  if (typeof apellidos !== 'string' || !apellidos.trim() || apellidos.length > 100) errores.push('Los apellidos son obligatorios (máximo 100 caracteres)')
  if (!validarCorreo(correo)) errores.push('El correo no es válido (dominios permitidos: duoc.cl, profesor.duoc.cl y gmail.com)')
  if (typeof contrasena !== 'string' || contrasena.length < 4 || contrasena.length > 10) errores.push('La contraseña debe tener entre 4 y 10 caracteres')
  if (typeof region !== 'string' || !region.trim() || region.length > 100) errores.push('La región es obligatoria')
  if (typeof comuna !== 'string' || !comuna.trim() || comuna.length > 100) errores.push('La comuna es obligatoria')
  if (typeof direccion !== 'string' || !direccion.trim() || direccion.length > 300) errores.push('La dirección es obligatoria (máximo 300 caracteres)')
  if (fechaNacimiento !== undefined && fechaNacimiento !== null && fechaNacimiento !== '') {
    if (typeof fechaNacimiento !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento) || Number.isNaN(Date.parse(fechaNacimiento))) {
      errores.push('La fecha de nacimiento debe tener el formato AAAA-MM-DD')
    }
  }
  return errores
}

export async function registrar(req, res) {
  const datos = req.body ?? {}
  const errores = validarRegistro(datos)
  if (errores.length) return res.status(400).json({ mensaje: 'Datos inválidos', errores })

  const hash = await bcrypt.hash(datos.contrasena, 10)

  try {
    // El tipo siempre es Cliente: nadie puede crearse como administrador desde el registro
    const { rows } = await pool.query(
      `INSERT INTO users
         (run, nombre, apellidos, correo, password_hash, tipo, fecha_nacimiento, region, comuna, direccion)
       VALUES ($1, $2, $3, $4, $5, 'Cliente', $6, $7, $8, $9)
       RETURNING id, nombre, correo, tipo`,
      [
        datos.run.toUpperCase(), datos.nombre.trim(), datos.apellidos.trim(),
        datos.correo.trim(), hash, datos.fechaNacimiento || null,
        datos.region.trim(), datos.comuna.trim(), datos.direccion.trim(),
      ]
    )
    const usuario = aUsuario(rows[0])
    // El usuario inicia sesion automaticamente al registrarse (RF-08)
    res.status(201).json({ token: generarToken(usuario), usuario })
  } catch (err) {
    if (err.code === '23505') {
      const campo = String(err.constraint).includes('correo') ? 'correo' : 'RUN'
      return res.status(409).json({ mensaje: `El ${campo} ya está registrado` })
    }
    throw err
  }
}

export async function login(req, res) {
  const { correo, contrasena } = req.body ?? {}
  if (typeof correo !== 'string' || typeof contrasena !== 'string' || !correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Debes enviar el correo y la contraseña' })
  }

  const { rows } = await pool.query(
    'SELECT id, nombre, correo, tipo, password_hash FROM users WHERE lower(correo) = lower($1)',
    [correo.trim()]
  )
  const fila = rows[0]
  const coincide = await bcrypt.compare(contrasena, fila ? fila.password_hash : HASH_FALSO)

  if (!fila || !coincide) {
    return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' })
  }

  const usuario = aUsuario(fila)
  res.json({ token: generarToken(usuario), usuario })
}

// Devuelve los datos del usuario del token (sirve para validar la sesion en el front)
export async function perfil(req, res) {
  const { rows } = await pool.query(
    'SELECT id, nombre, correo, tipo FROM users WHERE id = $1',
    [req.usuario.id]
  )
  if (!rows.length) return res.status(401).json({ mensaje: 'El usuario del token ya no existe' })
  res.json(aUsuario(rows[0]))
}