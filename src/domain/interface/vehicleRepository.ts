import { Vehicle } from '../entities/vehicle'

export interface VehicleRepository {
    create(vehicle: Vehicle): Promise<Vehicle>
    update(id: string, vehicle: Vehicle): Promise<Vehicle>
    get(id: string): Promise<Vehicle | null>
}
