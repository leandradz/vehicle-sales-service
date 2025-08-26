import { SalesUseCase } from '../../src/useCases/sales'
import { Sale } from '../../src/domain/entities/sale'

describe('SalesUseCase', () => {
    it('should throw error if update fails', async () => {
        const sale = { saleId: '1' } as Sale
        salesRepository.update.mockResolvedValue(null)
        await expect(useCase.update(sale)).rejects.toThrow(
            'Failed to update sale'
        )
    })

    it('should update sale and call vehicleService.update if cancelled', async () => {
        const sale = {
            saleId: '1',
            vehicleId: 'v1',
            saleStatus: 'CANCELLED',
        } as Sale
        salesRepository.update.mockResolvedValue(sale)
        vehicleService.update.mockResolvedValue({})
        const result = await useCase.update(sale)
        expect(result).toEqual(sale)
        expect(vehicleService.update).toHaveBeenCalledWith(
            'v1',
            expect.objectContaining({ isAvailable: true })
        )
    })
    const salesRepository = {
        create: jest.fn(),
        update: jest.fn(),
        get: jest.fn(),
    }
    const vehicleService = {
        findById: jest.fn(),
        update: jest.fn(),
    }
    const useCase = new SalesUseCase(salesRepository, vehicleService)

    it('should throw error if sale not found', async () => {
        salesRepository.get.mockResolvedValue(null)
        await expect(useCase.findById('invalid')).rejects.toThrow(
            'Sale not found'
        )
    })

    it('should return sale if found', async () => {
        const sale = { saleId: '1' } as Sale
        salesRepository.get.mockResolvedValue(sale)
        await expect(useCase.findById('1')).resolves.toBe(sale)
    })

    it('should throw error if vehicle does not exist', async () => {
        vehicleService.findById.mockResolvedValue(null)
        await expect(useCase.create('v1', 'doc')).rejects.toThrow(
            'Vehicle does not exist in vehicle-manager-service'
        )
    })

    it('should throw error if sale creation fails', async () => {
        vehicleService.findById.mockResolvedValue({ price: 100 })
        salesRepository.create.mockResolvedValue(null)
        await expect(useCase.create('v1', 'doc')).rejects.toThrow(
            'Failed to create sale'
        )
    })

    it('should throw error if vehicle update fails', async () => {
        vehicleService.findById.mockResolvedValue({ price: 100 })
        salesRepository.create.mockResolvedValue({
            saleId: '1',
            vehicleId: 'v1',
            clientDocument: 'doc',
            saleDate: '2025-08-25',
            saleStatus: 'REQUEST_RECEIVED',
            payment: { paymentLink: '', total: 100 },
        })
        vehicleService.update.mockResolvedValue(null)
        await expect(useCase.create('v1', 'doc')).rejects.toThrow(
            'Failed to fetch updated vehicle with sale'
        )
    })

    it('should create sale successfully', async () => {
        vehicleService.findById.mockResolvedValue({ price: 100 })
        const saleCreated = {
            saleId: '1',
            vehicleId: 'v1',
            clientDocument: 'doc',
            saleDate: '2025-08-25',
            saleStatus: 'REQUEST_RECEIVED',
            payment: { paymentLink: '', total: 100 },
        }
        salesRepository.create.mockResolvedValue(saleCreated)
        vehicleService.update.mockResolvedValue({})
        const result = await useCase.create('v1', 'doc')
        expect(result).toEqual(saleCreated)
    })
})
