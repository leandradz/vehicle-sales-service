import { SalesRepository } from '../domain/interface/salesRepository'
import { Vehicle } from '../domain/entities/vehicle'

export class SalesUseCase {
    private readonly salesRepository: SalesRepository

    constructor(salesRepository: SalesRepository) {
        this.salesRepository = salesRepository
    }

    async findById(vehicleId: string): Promise<Vehicle | null> {
        const vehicle = await this.salesRepository.get(vehicleId)
        if (!vehicle) {
            throw new Error('Vehicle not found')
        }
        return vehicle
    }

    async create(vehicle: Vehicle): Promise<Vehicle | null> {
        const createdVehicle = await this.salesRepository.create(vehicle)
        if (!createdVehicle) {
            throw new Error('Failed to create vehicle')
        }
        return createdVehicle
    }

    async update(vehicle: Vehicle): Promise<Vehicle | null> {
        const updatedVehicle = await this.salesRepository.update(
            vehicle.id,
            vehicle
        )
        if (!updatedVehicle) {
            throw new Error('Failed to update vehicle')
        }
        return updatedVehicle
    }
}
