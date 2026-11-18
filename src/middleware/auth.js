import jwt from 'jsonwebtoken'

// Valida el JWT enviado como "Authorization: Bearer <token>"
export function verificarToken(req, res, next) {
  const [esquema, token] = (req.headers.authorization ?? '').split(' ')
  if (esquema !== 'Bearer' || !token) {
    return res.status(401).json({ mensaje: 'Falta el token de autenticación' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
    req.usuario = { id: Number(payload.sub), correo: payload.correo, tipo: payload.tipo }
    next()
  } catch (err) {
    const mensaje = err.name === 'TokenExpiredError'
      ? 'El token expiró, inicia sesión nuevamente'
      : 'Token inválido'
    res.status(401).json({ mensaje })
  }
}

// Permite el acceso solo a los roles indicados. Se usa despues de verificarToken
export function requerirRol(...roles) {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.tipo)) {
      return res.status(403).json({ mensaje: 'No tienes permisos para realizar esta acción' })
    }
    next()
  }
}