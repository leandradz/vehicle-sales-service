import { Vehicle } from '../entities/vehicle'

export interface SalesRepository {
    create(vehicle: Vehicle): Promise<Vehicle>
    update(id: string, vehicle: Vehicle): Promise<Vehicle>
    get(id: string): Promise<Vehicle | null>
}
