import { Vehicle } from '../entities/vehicle'

export interface VehicleServicePort {
    findById(vehicleId: string): Promise<Vehicle | null>
    update(vehicle: Vehicle): Promise<Vehicle | null>
}
