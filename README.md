# Florae - API REST (plant-ecommerce-back)

Backend de la tienda Florae (Desarrollo Fullstack II, DSY1104, EP3). Front en React: https://github.com/danielacuevasd/plant-ecommerce-r

## Tecnologías

- Node.js + Express
- PostgreSQL (Supabase)
- Swagger (swagger-autogen + swagger-ui-express)
- JWT y roles (en desarrollo)

## Ejecución local

1. Instalar dependencias: `npm install`
2. Crear un archivo `.env` a partir de `.env.example` con los valores reales.
3. Crear las tablas ejecutando `src/db/schema.sql` en la base de datos.
4. Cargar los datos iniciales: `npm run seed`
5. Iniciar la API: `npm run dev`

La API queda en `http://localhost:3000` y la documentación en `http://localhost:3000/api-docs`.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto de la API (3000 por defecto) |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `CORS_ORIGIN` | Origen permitido del front |

## Estado de la EP3

| Requisito | Estado |
|---|---|
| CRUD de productos | Listo |
| Documentación Swagger | Listo (`/api-docs`) |
| Registro e inicio de sesión | Listo |
| Protección de rutas con JWT y roles | Listo |
| Flujo de contacto | Pendiente |

## Endpoints de productos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/products` | Lista productos (filtro opcional `?categoria=`) |
| GET | `/products/:id` | Detalle de un producto |
| POST | `/products` | Crea un producto |
| PUT | `/products/:id` | Actualiza un producto |
| DELETE | `/products/:id` | Elimina un producto |