// Mismas reglas que el front

const DOMINIOS_PERMITIDOS = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i

// RUN: 7 a 9 caracteres, sin puntos ni guion, solo numeros y una K opcional al final
export function validarRun(run) {
  if (typeof run !== 'string' || !/^\d{6,8}[0-9Kk]$/.test(run)) return false

  const cuerpo = run.slice(0, -1)
  const dv = run.slice(-1).toUpperCase()

  // Algoritmo modulo 11
  let suma = 0
  let multiplicador = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }
  const resto = 11 - (suma % 11)
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)

  return dv === esperado
}

// Correo: formato valido, maximo 100 caracteres y dominio permitido
export function validarCorreo(correo) {
  return typeof correo === 'string' && correo.length <= 100 && DOMINIOS_PERMITIDOS.test(correo)
}