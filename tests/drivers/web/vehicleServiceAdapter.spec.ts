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

    describe('findById', () => {
        beforeEach(() => {
            global.fetch = jest.fn()
        })
        afterEach(() => {
            jest.resetAllMocks()
        })

        it('should return vehicle on success', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({
                    id: '1',
                    brand: 'A',
                    model: 'B',
                    fabricationDate: 2020,
                    color: 'red',
                    price: 100,
                    isAvailable: true,
                }),
            })
            const adapter = new VehicleServiceAdapter('http://localhost')
            const result = await adapter.findById('1')
            expect(result?.id).toBe('1')
        })

        it('should return null if not found', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false })
            const adapter = new VehicleServiceAdapter('http://localhost')
            const result = await adapter.findById('1')
            expect(result).toBeNull()
        })
    })

    describe('update', () => {
        beforeEach(() => {
            global.fetch = jest.fn()
        })
        afterEach(() => {
            jest.resetAllMocks()
        })

        it('should return vehicle on success', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({
                    id: '1',
                    brand: 'A',
                    model: 'B',
                    fabricationDate: 2020,
                    color: 'red',
                    price: 100,
                    isAvailable: true,
                }),
            })
            const adapter = new VehicleServiceAdapter('http://localhost')
            const result = await adapter.update('1', { color: 'red' })
            expect(result?.id).toBe('1')
        })

        it('should return null if update fails', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false })
            const adapter = new VehicleServiceAdapter('http://localhost')
            const result = await adapter.update('1', { color: 'red' })
            expect(result).toBeNull()
        })
    })
})
