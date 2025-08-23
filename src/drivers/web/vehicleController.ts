import { Router, Request, Response } from 'express'
import { VehicleUseCase } from '../../useCases/vehicle'
import { Vehicle } from '../../domain/entities/vehicle'

export class VehicleController {
    private readonly routes: Router

    constructor(private readonly VehicleUseCase: VehicleUseCase) {
        this.routes = Router()
    }

    setupRoutes() {
        this.routes.post('/', this.create.bind(this))
        this.routes.put('/:vehicleId', this.update.bind(this))
        this.routes.get('/:vehicleId', this.findById.bind(this))
        return this.routes
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body
            if (
                !data.brand ||
                !data.model ||
                !data.fabricationDate ||
                !data.color ||
                !data.price
            ) {
                throw new Error('All fields are required')
            }
            const tempId = data.id || ''
            const vehicle = new Vehicle(
                tempId,
                data.brand,
                data.model,
                data.fabricationDate,
                data.color,
                data.price,
                data.isAvailable ?? false,
                data.clientDocument ?? null,
                data.saleDate ?? null
            )
            const result = await this.VehicleUseCase.create(vehicle)
            res.status(201).json(result)
        } catch (error) {
            console.log('Failed to create vehicle', error)
            res.status(500).json({ error: 'Failed to create vehicle' })
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { vehicleId } = req.params
            const newData = req.body
            const vehicleFound = await this.VehicleUseCase.findById(vehicleId)
            if (!vehicleFound) {
                throw new Error('Vehicle not found')
            }
            const updatedVehicle = new Vehicle(
                vehicleId,
                newData.brand ?? vehicleFound.brand,
                newData.model ?? vehicleFound.model,
                newData.fabricationDate ?? vehicleFound.fabricationDate,
                newData.color ?? vehicleFound.color,
                newData.price ?? vehicleFound.price,
                newData.isAvailable ?? vehicleFound.isAvailable,
                newData.clientDocument ?? vehicleFound.clientDocument,
                newData.saleDate ?? vehicleFound.saleDate
            )
            const result = await this.VehicleUseCase.update(updatedVehicle)
            res.status(200).json(result)
        } catch (error) {
            console.log('Failed to update vehicle', error)
            res.status(500).json({ error: 'Failed to update vehicle' })
        }
    }

    public async findById(req: Request, res: Response): Promise<void> {
        try {
            const { vehicleId } = req.params
            const vehicleFound = await this.VehicleUseCase.findById(vehicleId)
            if (!vehicleFound) {
                res.status(404).json({ error: 'Vehicle not found' })
                return
            }

            res.status(200).json(vehicleFound)
        } catch (error) {
            console.log('Failed to search vehicle', error)
            res.status(500).json({ error: 'Failed to search vehicle' })
        }
    }
}
