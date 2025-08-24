import { Vehicle } from '../entities/vehicle'

export interface VehicleServicePort {
    findById(vehicleId: string): Promise<Vehicle | null>
    update(
        vehicleId: string,
        vehicle: Partial<Vehicle>
    ): Promise<Vehicle | null>
}
