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
})
