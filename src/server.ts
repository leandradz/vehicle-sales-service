import express from 'express'
import { HealthCheckController } from './drivers/web/healthCheckController'
import { VehicleController } from './drivers/web/vehicleController'
import swaggerRouter from './config/swaggerConfig'
import { HealthCheckUseCase } from './useCases/healthCheck'
import { DynamoVehicleRepository } from './drivers/database/vehicleModel'
import { VehicleUseCase } from './useCases/vehicle'

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
        // Vehicle configuration
        const vehicleRepository = new DynamoVehicleRepository()
        const vehicleUseCase = new VehicleUseCase(vehicleRepository)
        const vehicleController = new VehicleController(vehicleUseCase)

        this.express.use('/vehicles', vehicleController.setupRoutes())

        // Health Check and Swagger configuration
        const healthCheckUseCase = new HealthCheckUseCase()
        const routesHealthCheckController = new HealthCheckController(
            healthCheckUseCase
        )
        this.express.use('/health', routesHealthCheckController.setupRoutes())
        this.express.use('/api-docs', swaggerRouter)
    }

    startServer() {
        const PORT = 3002
        this.express.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`)
        })
    }
}

const app = new InitProject()
app.start()
