import { SalesRepository } from '../../src/domain/interface/salesRepository'
import { MercadoPagoController } from '../../src/drivers/web/mercadoPagoController'
import { PaymentUseCase } from '../../src/useCases/payment'

describe('PaymentUseCase', () => {
    it('should throw error if convertQRCodeToImage fails', async () => {
        jest.spyOn(salesRepository, 'get').mockResolvedValue(saleMock)
        jest.spyOn(mercadoPagoController, 'getUserToken').mockResolvedValue({
            token: 'token',
            userId: 1,
        })
        jest.spyOn(
            mercadoPagoController,
            'generateQRCodeLink'
        ).mockResolvedValue({ qr_data: 'qrdata' })
        jest.spyOn(
            mercadoPagoController,
            'convertQRCodeToImage'
        ).mockRejectedValue(new Error('fail'))
        await expect(useCase.createPayment('1')).rejects.toThrow()
    })

    it('should throw error if salesRepository.update fails', async () => {
        jest.spyOn(salesRepository, 'get').mockResolvedValue(saleMock)
        jest.spyOn(mercadoPagoController, 'getUserToken').mockResolvedValue({
            token: 'token',
            userId: 1,
        })
        jest.spyOn(
            mercadoPagoController,
            'generateQRCodeLink'
        ).mockResolvedValue({ qr_data: 'qrdata' })
        jest.spyOn(
            mercadoPagoController,
            'convertQRCodeToImage'
        ).mockResolvedValue('image-url')
        jest.spyOn(salesRepository, 'update').mockImplementation(() => {
            throw new Error('update failed')
        })
        await expect(useCase.createPayment('1')).rejects.toThrow()
    })

    it('should throw error if sale not found in getPayment', async () => {
        jest.spyOn(salesRepository, 'get').mockResolvedValue(null)
        await expect(useCase.getPayment('notfound')).rejects.toThrow(
            'Sale not found'
        )
    })

    it('should return sale in getPayment', async () => {
        jest.spyOn(salesRepository, 'get').mockResolvedValue(saleMock)
        await expect(useCase.getPayment('1')).resolves.toEqual(saleMock)
    })

    describe('handlePaymentWebhook', () => {
        it('should warn and return if topic is not merchant_order', async () => {
            const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
            await useCase.handlePaymentWebhook({
                resource: 'r',
                topic: 'other',
            })
            expect(spy).toHaveBeenCalledWith('Invalid webhook topic:', 'other')
            spy.mockRestore()
        })

        it('should throw error if mercadoPagoData is invalid', async () => {
            jest.spyOn(
                mercadoPagoController,
                'getPaymentStatus'
            ).mockResolvedValue(null)
            await expect(
                useCase.handlePaymentWebhook({
                    resource: 'r',
                    topic: 'merchant_order',
                })
            ).rejects.toThrow('Invalid MercadoPago data')
        })

        it('should update sale status on valid webhook', async () => {
            jest.spyOn(
                mercadoPagoController,
                'getPaymentStatus'
            ).mockResolvedValue({ id: 'id1', status: 'paid' })
            jest.spyOn(salesRepository, 'update').mockResolvedValue({
                saleId: 'id1',
                saleStatus: 'paid',
                vehicleId: 'v1',
                clientDocument: 'doc',
                saleDate: '2025-08-25',
                payment: { paymentLink: '', total: 100 },
            })
            await expect(
                useCase.handlePaymentWebhook({
                    resource: 'r',
                    topic: 'merchant_order',
                })
            ).resolves.toBeUndefined()
        })
    })
    const mercadoPagoController = {
        getUserToken: jest.fn(),
        generateQRCodeLink: jest.fn(),
        convertQRCodeToImage: jest.fn(),
        getPaymentStatus: jest.fn(),
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

    const saleMock = {
        saleId: '1',
        vehicleId: 'vehicle-1',
        clientDocument: '12345678900',
        saleDate: '2025-08-25',
        saleStatus: 'completed',
        payment: {
            paymentLink: 'link',
            total: 100,
        },
    }

    it('should throw error if getUserToken fails', async () => {
        jest.spyOn(salesRepository, 'get').mockResolvedValue(saleMock)
        jest.spyOn(mercadoPagoController, 'getUserToken').mockResolvedValue(
            null
        )
        await expect(useCase.createPayment('1')).rejects.toThrow(
            'Failed to fetch QR code token'
        )
    })

    it('should throw error if generateQRCodeLink fails', async () => {
        jest.spyOn(salesRepository, 'get').mockResolvedValue(saleMock)
        jest.spyOn(mercadoPagoController, 'getUserToken').mockResolvedValue({
            token: 'token',
            userId: 1,
        })
        jest.spyOn(
            mercadoPagoController,
            'generateQRCodeLink'
        ).mockRejectedValue(new Error('fail'))
        await expect(useCase.createPayment('1')).rejects.toThrow()
    })

    it('should create payment successfully', async () => {
        jest.spyOn(salesRepository, 'get').mockResolvedValue(saleMock)
        jest.spyOn(mercadoPagoController, 'getUserToken').mockResolvedValue({
            token: 'token',
            userId: 1,
        })
        jest.spyOn(
            mercadoPagoController,
            'generateQRCodeLink'
        ).mockResolvedValue({ qr_data: 'qrdata' })
        jest.spyOn(
            mercadoPagoController,
            'convertQRCodeToImage'
        ).mockResolvedValue('image-url')
        jest.spyOn(salesRepository, 'update').mockResolvedValue({
            ...saleMock,
            payment: { total: 100, paymentLink: 'image-url' },
        })
        const result = await useCase.createPayment('1')
        expect(result.payment.paymentLink).toBe('image-url')
    })
})
