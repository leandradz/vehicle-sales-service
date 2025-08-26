import express from 'express'
import { VehicleServiceAdapter } from './drivers/web/vehicleServiceAdapter'
import { HealthCheckController } from './drivers/web/healthCheckController'
import { SalesController } from './drivers/web/salesController'
import swaggerRouter from './config/swaggerConfig'
import { HealthCheckUseCase } from './useCases/healthCheck'
import { DynamoSalesRepository } from './drivers/database/salesModel'
import { SalesUseCase } from './useCases/sales'
import { PaymentWebhookController } from './drivers/web/paymentWebhookController'
import { PaymentUseCase } from './useCases/payment'
import { MercadoPagoController } from './drivers/web/mercadoPagoController'

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
        const vehicleService = new VehicleServiceAdapter(
            process.env.VEHICLE_MANAGER_SERVICE_API ||
                'http://vehicle-manager-service:3002'
        )
        const salesUseCase = new SalesUseCase(salesRepository, vehicleService)
        const salesController = new SalesController(salesUseCase)

        this.express.use('/sales', salesController.setupRoutes())

        // Mercado Pago configuration
        const mercadoPagoController = new MercadoPagoController()

        // Payment configuration
        const paymentUseCase = new PaymentUseCase(
            mercadoPagoController,
            salesRepository
        )
        const paymentWebhookController = new PaymentWebhookController(
            paymentUseCase
        )
        this.express.use('/payment', paymentWebhookController.setupRoutes())

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
