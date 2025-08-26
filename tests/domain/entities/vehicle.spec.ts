import { Vehicle } from '../../../src/domain/entities/vehicle'

describe('Vehicle Entity', () => {
    it('should create a vehicle with correct properties', () => {
        const vehicle = new Vehicle(
            '1',
            'Toyota',
            'Corolla',
            2020,
            'Black',
            50000,
            true,
            '12345678900',
            '2025-08-25',
            'sold',
            'sale-1'
        )
        expect(vehicle.id).toBe('1')
        expect(vehicle.brand).toBe('Toyota')
        expect(vehicle.model).toBe('Corolla')
        expect(vehicle.fabricationDate).toBe(2020)
        expect(vehicle.color).toBe('Black')
        expect(vehicle.price).toBe(50000)
        expect(vehicle.isAvailable).toBe(true)
        expect(vehicle.clientDocument).toBe('12345678900')
        expect(vehicle.saleDate).toBe('2025-08-25')
        expect(vehicle.saleStatus).toBe('sold')
        expect(vehicle.saleId).toBe('sale-1')
    })

    it('should set default values for optional properties', () => {
        const vehicle = new Vehicle('2', 'Honda', 'Civic', 2021, 'White', 60000)
        expect(vehicle.isAvailable).toBe(false)
        expect(vehicle.clientDocument).toBeNull()
        expect(vehicle.saleDate).toBeNull()
        expect(vehicle.saleStatus).toBeNull()
        expect(vehicle.saleId).toBeNull()
    })
})
