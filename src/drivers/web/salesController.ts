import { Router, Request, Response } from 'express'
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
