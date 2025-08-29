import { Router, Request, Response } from 'express'

/**
 * @swagger
 * /:
 *   post:
 *     summary: Cria uma nova venda
 *     description: Cria uma venda de veículo para um cliente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleId:
 *                 type: string
 *                 example: "abc123"
 *               clientDocument:
 *                 type: string
 *                 example: "12345678900"
 *     responses:
 *       201:
 *         description: Venda criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Falha ao criar venda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to create sale
 */

/**
 * @swagger
 * /{saleId}:
 *   get:
 *     summary: Busca uma venda pelo ID
 *     description: Retorna os dados de uma venda específica.
 *     parameters:
 *       - in: path
 *         name: saleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da venda
 *     responses:
 *       200:
 *         description: Venda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Falha ao buscar venda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to find sale
 */

/**
 * @swagger
 * /{saleId}:
 *   put:
 *     summary: Atualiza uma venda
 *     description: Atualiza os dados de uma venda existente.
 *     parameters:
 *       - in: path
 *         name: saleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da venda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Venda atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Falha ao atualizar venda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to update sale
 */
import { SalesUseCase } from '../../useCases/sales'

export class SalesController {
    private readonly routes: Router

    constructor(private readonly SalesUseCase: SalesUseCase) {
        this.routes = Router()
    }

    setupRoutes() {
        this.routes.post('/', this.create.bind(this))
        this.routes.put('/:saleId', this.update.bind(this))
        this.routes.get('/:saleId', this.findById.bind(this))
        return this.routes
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const { vehicleId, clientDocument } = req.body

            if (!vehicleId || !clientDocument) {
                throw new Error(
                    'vehicleId and clientDocument fields are required'
                )
            }

            const result = await this.SalesUseCase.create(
                vehicleId,
                clientDocument
            )

            res.status(201).json(result)
        } catch (error) {
            console.log('Failed to create sale', error)
            res.status(500).json({ error: 'Failed to create sale' })
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { saleId } = req.params
            const newData = req.body
            const saleFound = await this.SalesUseCase.findById(saleId)
            if (!saleFound) {
                throw new Error('Sale not found')
            }

            const updatedSale = {
                ...saleFound,
                ...newData,
            }
            const result = await this.SalesUseCase.update(updatedSale)
            res.status(200).json(result)
        } catch (error) {
            console.log('Failed to update sale', error)
            res.status(500).json({ error: 'Failed to update sale' })
        }
    }

    public async findById(req: Request, res: Response): Promise<void> {
        try {
            const { saleId } = req.params
            const saleFound = await this.SalesUseCase.findById(saleId)
            if (!saleFound) {
                res.status(404).json({ error: 'Sale not found' })
                return
            }

            res.status(200).json(saleFound)
        } catch (error) {
            console.log('Failed to search sale', error)
            res.status(500).json({ error: 'Failed to search sale' })
        }
    }
}
