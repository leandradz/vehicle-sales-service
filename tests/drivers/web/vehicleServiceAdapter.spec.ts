import { VehicleServiceAdapter } from '../../../src/drivers/web/vehicleServiceAdapter'

describe('VehicleServiceAdapter', () => {
    it('should instantiate adapter', () => {
        const adapter = new VehicleServiceAdapter('http://localhost')
        expect(adapter).toBeInstanceOf(VehicleServiceAdapter)
    })

    it('should have findById and update methods', () => {
        const adapter = new VehicleServiceAdapter('http://localhost')
        expect(typeof adapter.findById).toBe('function')
        expect(typeof adapter.update).toBe('function')
    })
})
