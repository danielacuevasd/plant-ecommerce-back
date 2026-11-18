import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    title: 'API de Florae',
    description: 'Documentacion de la API REST de Florae',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Escribe: Bearer <token> (el token se obtiene en /auth/login)',
    },
  },
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./src/app.js']

swaggerAutogen()(outputFile, endpointsFiles, doc)