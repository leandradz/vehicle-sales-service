import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import { Router } from 'express'

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Fase 4: Vehicle Manager Service API',
            version: '1.0.0',
            description: 'Fase 4: API para gerenciar cadastro de veículos',
        },
    },
    apis: ['./src/drivers/web/*.ts'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

const swaggerRouter = Router()

swaggerRouter.use('/', swaggerUi.serve)
swaggerRouter.get('/', swaggerUi.setup(swaggerDocs))

export default swaggerRouter
