import { VehicleRepository } from '../domain/interface/vehicleRepository'
import { Vehicle } from '../domain/entities/vehicle'

export class VehicleUseCase {
    private readonly vehicleRepository: VehicleRepository

    constructor(vehicleRepository: VehicleRepository) {
        this.vehicleRepository = vehicleRepository
    }

    async findById(vehicleId: string): Promise<Vehicle | null> {
        const vehicle = await this.vehicleRepository.get(vehicleId)
        if (!vehicle) {
            throw new Error('Vehicle not found')
        }
        return vehicle
    }

    async create(vehicle: Vehicle): Promise<Vehicle | null> {
        const createdVehicle = await this.vehicleRepository.create(vehicle)
        if (!createdVehicle) {
            throw new Error('Failed to create vehicle')
        }
        return createdVehicle
    }

    async update(vehicle: Vehicle): Promise<Vehicle | null> {
        const updatedVehicle = await this.vehicleRepository.update(vehicle.id, vehicle)
        if (!updatedVehicle) {
            throw new Error('Failed to update vehicle')
        }
        return updatedVehicle
    }
}
