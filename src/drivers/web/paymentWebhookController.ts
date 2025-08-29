import { Router, Request, Response } from 'express'

/**
 * @swagger
 * /payment/webhook:
 *   post:
 *     summary: Recebe notificações de pagamento (webhook)
 *     description: Processa notificações de pagamento enviadas por provedores externos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Webhook processed
 *       500:
 *         description: Falha ao processar webhook
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to process payment webhook
 */

/**
 * @swagger
 * /payment/create:
 *   post:
 *     summary: Cria um pagamento para uma venda
 *     description: Cria o registro de pagamento vinculado a uma venda existente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               saleId:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       201:
 *         description: Pagamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: saleId ausente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: saleId is required
 *       500:
 *         description: Falha ao criar pagamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to create payment
 */
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
