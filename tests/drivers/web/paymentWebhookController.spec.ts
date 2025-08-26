import { PaymentWebhookController } from '../../../src/drivers/web/paymentWebhookController'
import { PaymentUseCase } from '../../../src/useCases/payment'
import { Request, Response } from 'express'

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

    describe('createPayment', () => {
        it('should return 400 if saleId is missing', async () => {
            const paymentUseCase = {
                createPayment: jest.fn(),
            } as unknown as PaymentUseCase
            const controller = new PaymentWebhookController(paymentUseCase)
            const req = { body: {} } as unknown as Request
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response
            await controller.createPayment(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: 'saleId is required',
            })
        })

        it('should return 201 with saleWithPayment on success', async () => {
            const saleWithPayment = { id: '1' }
            const paymentUseCase = {
                createPayment: jest.fn().mockResolvedValue(saleWithPayment),
            } as unknown as PaymentUseCase
            const controller = new PaymentWebhookController(paymentUseCase)
            const req = { body: { saleId: '1' } } as Request
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response
            await controller.createPayment(req, res)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith(saleWithPayment)
        })

        it('should return 500 on error', async () => {
            const paymentUseCase = {
                createPayment: jest.fn().mockRejectedValue(new Error('fail')),
            } as unknown as PaymentUseCase
            const controller = new PaymentWebhookController(paymentUseCase)
            const req = { body: { saleId: '1' } } as Request
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response
            await controller.createPayment(req, res)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to create payment',
            })
        })
    })

    describe('handleWebhook', () => {
        it('should return 200 on success', async () => {
            const paymentUseCase = {
                handlePaymentWebhook: jest.fn().mockResolvedValue(undefined),
            } as unknown as PaymentUseCase
            const controller = new PaymentWebhookController(paymentUseCase)
            const req = { body: { some: 'data' } } as Request
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response
            await controller.handleWebhook(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                status: 'Webhook processed',
            })
        })

        it('should return 500 on error', async () => {
            const paymentUseCase = {
                handlePaymentWebhook: jest
                    .fn()
                    .mockRejectedValue(new Error('fail')),
            } as unknown as PaymentUseCase
            const controller = new PaymentWebhookController(paymentUseCase)
            const req = { body: { some: 'data' } } as Request
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response
            await controller.handleWebhook(req, res)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to process payment webhook',
            })
        })
    })
})
