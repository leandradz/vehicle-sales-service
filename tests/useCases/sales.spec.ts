import { SalesUseCase } from '../../src/useCases/sales'
import { Sale } from '../../src/domain/entities/sale'

describe('SalesUseCase', () => {
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
})
