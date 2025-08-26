jest.mock('qrcode', () => ({
    toDataURL: (_data: string, cb: (err: unknown, url: string) => void) =>
        cb(null, 'image-data'),
}))

import { Sale } from '../../../src/domain/entities/sale'
import { MercadoPagoController } from '../../../src/drivers/web/mercadoPagoController'

describe('MercadoPagoController', () => {
    it('should instantiate controller', () => {
        const controller = new MercadoPagoController()
        expect(controller).toBeInstanceOf(MercadoPagoController)
    })

    it('should have getUserToken, generateQRCodeLink, convertQRCodeToImage methods', () => {
        const controller = new MercadoPagoController()
        expect(typeof controller.getUserToken).toBe('function')
        expect(typeof controller.generateQRCodeLink).toBe('function')
        expect(typeof controller.convertQRCodeToImage).toBe('function')
    })

    describe('getUserToken', () => {
        beforeEach(() => {
            global.fetch = jest.fn()
        })
        afterEach(() => {
            jest.resetAllMocks()
        })

        it('should return token and userId on success', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue({
                json: async () => ({
                    token_type: 'Bearer',
                    access_token: 'abc',
                    user_id: 123,
                }),
            })
            const controller = new MercadoPagoController()
            const result = await controller.getUserToken()
            expect(result).toEqual({ token: 'Bearer abc', userId: 123 })
        })

        it('should throw error on fetch failure', async () => {
            ;(global.fetch as jest.Mock).mockRejectedValue(new Error('fail'))
            const controller = new MercadoPagoController()
            await expect(controller.getUserToken()).rejects.toThrow(
                'Failed to fetch Mercado Pago Token'
            )
        })
    })

    describe('generateQRCodeLink', () => {
        it('should throw error if qr_data is missing', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                json: async () => ({}),
            })
            const controller = new MercadoPagoController()
            await expect(
                controller.generateQRCodeLink(
                    { token: 'Bearer abc', userId: 123 },
                    {
                        saleId: '1',
                        vehicleId: 'vehicle-1',
                        clientDocument: '12345678900',
                        saleDate: '2025-08-25',
                        saleStatus: 'completed',
                        payment: {
                            paymentLink: 'http://payment.link',
                            total: 100,
                        },
                    } as Sale
                )
            ).rejects.toThrow('Failed to generate QR code link')
        })
        it('should throw error if fetch fails', async () => {
            global.fetch = jest.fn().mockRejectedValue(new Error('fail'))
            const controller = new MercadoPagoController()
            await expect(
                controller.generateQRCodeLink(
                    { token: 'Bearer abc', userId: 123 },
                    {
                        saleId: '1',
                        vehicleId: 'vehicle-1',
                        clientDocument: '12345678900',
                        saleDate: '2025-08-25',
                        saleStatus: 'completed',
                        payment: {
                            paymentLink: 'http://payment.link',
                            total: 100,
                        },
                    } as Sale
                )
            ).rejects.toThrow()
        })
    })

    describe('convertQRCodeToImage', () => {
        it('should throw error if QRCode.toDataURL fails', async () => {
            jest.resetModules()
            jest.doMock('qrcode', () => ({
                toDataURL: (
                    _data: string,
                    cb: (err: unknown, url: string) => void
                ) => cb(new Error('fail'), ''),
            }))
            const { MercadoPagoController } = await import(
                '../../../src/drivers/web/mercadoPagoController'
            )

            // Importa MercadoPagoController após o mock
            const controller = new MercadoPagoController()
            await expect(
                controller.convertQRCodeToImage('qrdata')
            ).rejects.toThrow('Failed to generate QR Code Image')
        })
        describe('getPaymentStatus', () => {
            beforeEach(() => {
                global.fetch = jest.fn()
            })
            afterEach(() => {
                jest.resetAllMocks()
            })

            it('should return id and status on success', async () => {
                const controller = new MercadoPagoController()
                jest.spyOn(controller, 'getUserToken').mockResolvedValue({
                    token: 'Bearer abc',
                    userId: 123,
                })
                ;(global.fetch as jest.Mock).mockResolvedValue({
                    json: async () => ({
                        external_reference: 'id1',
                        order_status: 'paid',
                    }),
                })
                const result = await controller.getPaymentStatus('url')
                expect(result).toEqual({ id: 'id1', status: 'paid' })
            })

            it('should throw error if getUserToken fails', async () => {
                const controller = new MercadoPagoController()
                jest.spyOn(controller, 'getUserToken').mockRejectedValue(
                    new Error('fail')
                )
                await expect(
                    controller.getPaymentStatus('url')
                ).rejects.toThrow('Failed to generate QR code link')
            })

            it('should throw error if fetch fails', async () => {
                const controller = new MercadoPagoController()
                jest.spyOn(controller, 'getUserToken').mockResolvedValue({
                    token: 'Bearer abc',
                    userId: 123,
                })
                ;(global.fetch as jest.Mock).mockRejectedValue(
                    new Error('fail')
                )
                await expect(
                    controller.getPaymentStatus('url')
                ).rejects.toThrow('Failed to generate QR code link')
            })
        })
        it('should call QRCode.toDataURL', async () => {
            const controller = new MercadoPagoController()
            const result = await controller.convertQRCodeToImage('qrdata')
            expect(result).toBe('image-data')
        })
    })
})
