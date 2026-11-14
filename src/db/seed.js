// Carga los datos iniciales de la tienda
// Ejecutarlo varias veces no duplica productos ni usuarios
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { pool } from './pool.js'

const productos = [
  {
    codigo: 'PL-001', nombre: 'Monstera Deliciosa', categoria: 'interior',
    precio: 18990, stock: 12, stockCritico: 3,
    descripcion: 'La Monstera Deliciosa es una de las plantas de interior más populares por sus hojas grandes con recortes característicos. Prefiere luz indirecta y riego moderado, ideal para espacios luminosos sin sol directo.',
    imagen: '/img/monstera.jpg',
  },
  {
    codigo: 'PL-002', nombre: 'Potus Verde', categoria: 'interior',
    precio: 8990, stock: 20, stockCritico: 5,
    descripcion: 'El Potus es una planta trepadora o colgante muy resistente, perfecta para quienes recién comienzan en el mundo de las plantas. Tolera baja luminosidad y riego espaciado.',
    imagen: '/img/potus.jpg',
  },
  {
    codigo: 'PL-003', nombre: 'Calathea Orbifolia', categoria: 'interior',
    precio: 14990, stock: 3, stockCritico: 3,
    descripcion: 'La Calathea Orbifolia destaca por sus hojas redondeadas con vetas plateadas. Necesita humedad ambiental y luz indirecta. Es una planta no tóxica, apta para hogares con mascotas.',
    imagen: '/img/calathea.jpg',
  },
  {
    codigo: 'PL-004', nombre: 'Lavanda', categoria: 'exterior',
    precio: 6990, stock: 15, stockCritico: 4,
    descripcion: 'La lavanda es un arbusto perenne muy aromático, perfecto para jardines exteriores con buena exposición solar. Atrae polinizadores y requiere riego escaso una vez establecida.',
    imagen: '/img/lavanda.jpg',
  },
  {
    codigo: 'PL-005', nombre: 'Suculenta Echeveria', categoria: 'exterior',
    precio: 4990, stock: 30, stockCritico: 8,
    descripcion: 'La Echeveria es una suculenta de roseta compacta, ideal para espacios con mucha luz. Requiere riego muy espaciado y es perfecta para quienes buscan plantas de bajo mantenimiento.',
    imagen: '/img/echeveria.jpg',
  },
  {
    codigo: 'MC-001', nombre: 'Maceta Cerámica Blanca', categoria: 'macetas',
    precio: 9990, stock: 25, stockCritico: 5,
    descripcion: 'Maceta de cerámica esmaltada color blanco, con orificio de drenaje y plato incluido. Diámetro de 20 cm, ideal para plantas de interior medianas.',
    imagen: '/img/maceta-blanca.jpg',
  },
  {
    codigo: 'SU-001', nombre: 'Sustrato Universal 5L', categoria: 'sustratos',
    precio: 5990, stock: 40, stockCritico: 10,
    descripcion: 'Sustrato universal balanceado, apto para el trasplante de la mayoría de las plantas de interior y exterior. Presentación de 5 litros.',
    imagen: '/img/sustrato.jpg',
  },
  {
    codigo: 'HT-001', nombre: 'Set de Herramientas de Jardín', categoria: 'herramientas',
    precio: 12990, stock: 10, stockCritico: 2,
    descripcion: 'Set de herramientas básicas de jardinería en acero inoxidable con mango ergonómico: pala de trasplante, rastrillo de mano y tijera de podar.',
    imagen: '/img/herramientas.jpg',
  },
]

const usuarios = [
  {
    run: '191102207', nombre: 'Camila', apellidos: 'Reyes Soto',
    correo: 'camila.reyes@gmail.com', contrasena: 'cliente', tipo: 'Cliente',
    region: 'Región Metropolitana de Santiago', comuna: 'Santiago',
    direccion: 'Av. Siempre Viva 123, Santiago',
  },
  {
    run: '128374655', nombre: 'Matías', apellidos: 'Fuentes Lara',
    correo: 'matias.fuentes@duoc.cl', contrasena: 'vendedor', tipo: 'Vendedor',
    region: 'Región de Valparaíso', comuna: 'Viña del Mar',
    direccion: 'Calle Los Aromos 456, Viña del Mar',
  },
  {
    run: '175293841', nombre: 'Marcelo', apellidos: 'Cáceres',
    correo: 'marcelo.caceres@profesor.duoc.cl', contrasena: 'admin', tipo: 'Administrador',
    region: 'Región Metropolitana de Santiago', comuna: 'Ñuñoa',
    direccion: 'Pasaje Las Flores 789, Ñuñoa',
  },
]

async function sembrar() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    for (const p of productos) {
      await client.query(
        `INSERT INTO products
           (codigo, nombre, descripcion, categoria, precio, stock, stock_critico, imagen)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING`,
        [p.codigo, p.nombre, p.descripcion, p.categoria, p.precio, p.stock, p.stockCritico, p.imagen]
      )
    }

    for (const u of usuarios) {
      // La contraseña se guarda cifrada, nunca en texto plano
      const hash = await bcrypt.hash(u.contrasena, 10)
      await client.query(
        `INSERT INTO users
           (run, nombre, apellidos, correo, password_hash, tipo, region, comuna, direccion)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT DO NOTHING`,
        [u.run, u.nombre, u.apellidos, u.correo, hash, u.tipo, u.region, u.comuna, u.direccion]
      )
    }

    await client.query('COMMIT')

    const prod = await client.query('SELECT count(*) FROM products')
    const usr = await client.query('SELECT count(*) FROM users')
    console.log(`Listo: ${prod.rows[0].count} productos y ${usr.rows[0].count} usuarios en la base`)
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error al cargar los datos:', err.message)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

sembrar()