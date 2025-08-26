import { Router, Request, Response } from 'express'
import { PaymentUseCase } from '../../useCases/payment'

export class PaymentWebhookController {
    private readonly router: Router

    constructor(private readonly paymentUseCase: PaymentUseCase) {
        this.router = Router()
        this.setupRoutes()
    }

    setupRoutes(): Router {
        this.router.post('/webhook', this.handleWebhook.bind(this))
        this.router.post('/create', this.createPayment.bind(this))
        return this.router
    }

    async createPayment(req: Request, res: Response): Promise<void> {
        try {
            const { saleId } = req.body
            if (!saleId) {
                res.status(400).json({ error: 'saleId is required' })
                return
            }

            const saleWithPayment =
                await this.paymentUseCase.createPayment(saleId)
            res.status(201).json(saleWithPayment)
        } catch (error) {
            console.error('Failed to create payment:', error)
            res.status(500).json({ error: 'Failed to create payment' })
        }
    }

    async handleWebhook(req: Request, res: Response): Promise<void> {
        try {
            await this.paymentUseCase.handlePaymentWebhook(req.body)
            res.status(200).json({ status: 'Webhook processed' })
        } catch (error) {
            console.error('Failed to process payment webhook:', error)
            res.status(500).json({ error: 'Failed to process payment webhook' })
        }
    }
}
