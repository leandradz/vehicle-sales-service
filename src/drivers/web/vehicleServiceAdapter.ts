import { Vehicle } from '../../domain/entities/vehicle'
import { VehicleServicePort } from '../../domain/interface/vehicleServicePort'

export class VehicleServiceAdapter implements VehicleServicePort {
    private readonly baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    async findById(vehicleId: string): Promise<Vehicle | null> {
        const response = await fetch(`${this.baseUrl}/vehicles/${vehicleId}`)
        if (!response.ok) {
            return null
        }
        const data = (await response.json()) as Partial<Vehicle>
        if (!data || !data.id) return null
        return new Vehicle(
            data.id,
            data.brand ?? '',
            data.model ?? '',
            data.fabricationDate ?? 0,
            data.color ?? '',
            data.price ?? 0,
            data.isAvailable ?? false,
            data.saleId ?? null
        )
    }

    async update(
        vehicleId: string,
        vehicle: Partial<Vehicle>
    ): Promise<Vehicle | null> {
        const response = await fetch(`${this.baseUrl}/vehicles/${vehicleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vehicle),
        })
        if (!response.ok) {
            return null
        }

        const data = (await response.json()) as Partial<Vehicle>

        if (!data || !data.id) return null
        return new Vehicle(
            data.id,
            data.brand ?? '',
            data.model ?? '',
            data.fabricationDate ?? 0,
            data.color ?? '',
            data.price ?? 0,
            data.isAvailable ?? false,
            data.saleId ?? null
        )
    }
}
