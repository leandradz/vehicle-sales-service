import { SalesRepository } from '../../src/domain/interface/salesRepository'
import { MercadoPagoController } from '../../src/drivers/web/mercadoPagoController'
import { PaymentUseCase } from '../../src/useCases/payment'

describe('PaymentUseCase', () => {
    const mercadoPagoController = {
        getUserToken: jest.fn(),
        generateQRCodeLink: jest.fn(),
        convertQRCodeToImage: jest.fn(),
    } as unknown as MercadoPagoController
    const salesRepository = {
        get: jest.fn(),
        update: jest.fn(),
    } as unknown as SalesRepository

    const useCase = new PaymentUseCase(mercadoPagoController, salesRepository)

    it('should throw error if saleId is not provided', async () => {
        await expect(useCase.createPayment('')).rejects.toThrow(
            'Sale ID is required'
        )
    })

    it('should throw error if sale does not exist', async () => {
        jest.spyOn(salesRepository, 'get').mockImplementation(() =>
            Promise.resolve(null)
        )
        await expect(useCase.createPayment('invalid')).rejects.toThrow(
            'Sale with ID invalid does not exist'
        )
    })
})
