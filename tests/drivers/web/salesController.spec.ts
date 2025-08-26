import { SalesController } from '../../../src/drivers/web/salesController'
import { SalesUseCase } from '../../../src/useCases/sales'

describe('SalesController', () => {
    it('should instantiate controller', () => {
        const useCase = {} as SalesUseCase
        const controller = new SalesController(useCase)
        expect(controller).toBeInstanceOf(SalesController)
    })

    it('should setup routes', () => {
        const useCase = {} as SalesUseCase
        const controller = new SalesController(useCase)
        const router = controller.setupRoutes()
        expect(router).toBeDefined()
    })
})
