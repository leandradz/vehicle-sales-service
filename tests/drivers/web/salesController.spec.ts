import { SalesController } from '../../../src/drivers/web/salesController'
import { SalesUseCase } from '../../../src/useCases/sales'
import { Request, Response } from 'express'

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

    describe('controller methods', () => {
        let useCase: {
            create: jest.Mock
            update: jest.Mock
            findById: jest.Mock
        }
        let controller: SalesController
        let req: {
            body: Record<string, unknown>
            params: Record<string, unknown>
        }
        let res: { status: jest.Mock; json: jest.Mock }
        beforeEach(() => {
            useCase = {
                create: jest.fn(),
                update: jest.fn(),
                findById: jest.fn(),
            }
            controller = new SalesController(useCase as unknown as SalesUseCase)
            req = { body: {}, params: {} }
            res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        })

        it('create - sucesso', async () => {
            req.body = { vehicleId: 'v1', clientDocument: 'doc' }
            useCase.create.mockResolvedValue({ saleId: '1' })
            await controller.create(req as Request, res as unknown as Response)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({ saleId: '1' })
        })

        it('create - erro campos obrigatórios', async () => {
            req.body = { vehicleId: '', clientDocument: '' }
            await controller.create(req as Request, res as unknown as Response)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to create sale',
            })
        })

        it('create - erro interno', async () => {
            req.body = { vehicleId: 'v1', clientDocument: 'doc' }
            useCase.create.mockRejectedValue(new Error('fail'))
            await controller.create(req as Request, res as unknown as Response)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to create sale',
            })
        })

        it('update - sucesso', async () => {
            req.params = { saleId: '1' }
            req.body = { saleStatus: 'UPDATED' }
            useCase.findById.mockResolvedValue({ saleId: '1' })
            useCase.update.mockResolvedValue({
                saleId: '1',
                saleStatus: 'UPDATED',
            })
            await controller.update(req as Request, res as unknown as Response)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                saleId: '1',
                saleStatus: 'UPDATED',
            })
        })

        it('update - sale não encontrada', async () => {
            req.params = { saleId: '1' }
            useCase.findById.mockResolvedValue(null)
            await controller.update(req as Request, res as unknown as Response)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to update sale',
            })
        })

        it('update - erro interno', async () => {
            req.params = { saleId: '1' }
            useCase.findById.mockResolvedValue({ saleId: '1' })
            useCase.update.mockRejectedValue(new Error('fail'))
            await controller.update(req as Request, res as unknown as Response)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to update sale',
            })
        })

        it('findById - sucesso', async () => {
            req.params = { saleId: '1' }
            useCase.findById.mockResolvedValue({ saleId: '1' })
            await controller.findById(
                req as Request,
                res as unknown as Response
            )
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ saleId: '1' })
        })

        it('findById - sale não encontrada', async () => {
            req.params = { saleId: '1' }
            useCase.findById.mockResolvedValue(null)
            await controller.findById(
                req as Request,
                res as unknown as Response
            )
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: 'Sale not found' })
        })

        it('findById - erro interno', async () => {
            req.params = { saleId: '1' }
            useCase.findById.mockRejectedValue(new Error('fail'))
            await controller.findById(
                req as Request,
                res as unknown as Response
            )
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to search sale',
            })
        })
    })
})
