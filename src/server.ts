import express from 'express'
import { HealthCheckController } from './drivers/web/healthCheckController'
import { SalesController } from './drivers/web/salesController'
import swaggerRouter from './config/swaggerConfig'
import { HealthCheckUseCase } from './useCases/healthCheck'
import { DynamoSalesRepository } from './drivers/database/vehicleModel'
import { SalesUseCase } from './useCases/sales'

class InitProject {
    public express: express.Application

    constructor() {
        this.express = express()
    }

    async start() {
        try {
            this.express.use(express.json())
            this.setupRoutes()
            this.startServer()
        } catch (error) {
            console.error('Failed to start application:', error)
        }
    }

    setupRoutes() {
        // Sales configuration
        const salesRepository = new DynamoSalesRepository()
        const salesUseCase = new SalesUseCase(salesRepository)
        const salesController = new SalesController(salesUseCase)

        this.express.use('/sales', salesController.setupRoutes())

        // Health Check and Swagger configuration
        const healthCheckUseCase = new HealthCheckUseCase()
        const routesHealthCheckController = new HealthCheckController(
            healthCheckUseCase
        )
        this.express.use('/health', routesHealthCheckController.setupRoutes())
        this.express.use('/api-docs', swaggerRouter)
    }

    startServer() {
        const PORT = 3001
        this.express.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`)
        })
    }
}

const app = new InitProject()
app.start()
