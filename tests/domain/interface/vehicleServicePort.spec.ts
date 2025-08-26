import { VehicleServicePort } from '../../../src/domain/interface/vehicleServicePort'

describe('VehicleServicePort Interface', () => {
    it('should define findById and update methods', () => {
        const port: VehicleServicePort = {
            findById: jest.fn(),
            update: jest.fn(),
        }
        expect(typeof port.findById).toBe('function')
        expect(typeof port.update).toBe('function')
    })
})
