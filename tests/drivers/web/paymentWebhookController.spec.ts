import { PaymentWebhookController } from '../../../src/drivers/web/paymentWebhookController'
import { PaymentUseCase } from '../../../src/useCases/payment'

describe('PaymentWebhookController', () => {
    it('should instantiate controller', () => {
        const useCase = {} as PaymentUseCase
        const controller = new PaymentWebhookController(useCase)
        expect(controller).toBeInstanceOf(PaymentWebhookController)
    })

    it('should setup routes', () => {
        const useCase = {} as PaymentUseCase
        const controller = new PaymentWebhookController(useCase)
        const router = controller.setupRoutes()
        expect(router).toBeDefined()
    })
})
