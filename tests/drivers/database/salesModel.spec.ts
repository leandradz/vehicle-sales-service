import { Sale } from '../../../src/domain/entities/sale'
import { DynamoSalesRepository } from '../../../src/drivers/database/salesModel'
import * as libDynamodb from '@aws-sdk/lib-dynamodb'

describe('DynamoSalesRepository', () => {
    let sendMock: jest.SpyInstance

    beforeEach(() => {
        sendMock = jest.spyOn(
            libDynamodb.DynamoDBDocumentClient.prototype,
            'send'
        )
    })

    afterEach(() => {
        sendMock.mockRestore()
    })
    it('should instantiate repository', () => {
        const repo = new DynamoSalesRepository()
        expect(repo).toBeInstanceOf(DynamoSalesRepository)
    })

    it('should have create, get, update, listByStatus methods', () => {
        const repo = new DynamoSalesRepository()
        expect(typeof repo.create).toBe('function')
        expect(typeof repo.get).toBe('function')
        expect(typeof repo.update).toBe('function')
        expect(typeof repo.listByStatus).toBe('function')
    })

    describe('repository methods', () => {
        let repo: DynamoSalesRepository
        let sendMock: jest.SpyInstance
        beforeEach(() => {
            repo = new DynamoSalesRepository()
            sendMock = jest.spyOn(
                libDynamodb.DynamoDBDocumentClient.prototype,
                'send'
            )
        })

        afterEach(() => {
            sendMock.mockRestore()
        })

        it('create should return sale', async () => {
            sendMock.mockResolvedValue({})
            const sale = {
                saleId: '1',
                vehicleId: 'v1',
                clientDocument: 'doc',
                saleDate: '2025-08-25',
                saleStatus: 'REQUEST_RECEIVED',
                payment: { paymentLink: '', total: 100 },
            }
            const result = await repo.create(sale as Sale)
            expect(result.saleId).toBe('1')
        })

        it('get should return sale if found', async () => {
            sendMock.mockResolvedValue({ Item: { saleId: '1' } })
            const result = await repo.get('1')
            expect(result?.saleId).toBe('1')
        })

        it('get should return null if not found', async () => {
            sendMock.mockResolvedValue({ Item: undefined })
            const result = await repo.get('2')
            expect(result).toBeNull()
        })

        it('update should return updated sale', async () => {
            sendMock.mockResolvedValue({
                Attributes: { saleId: '1', saleStatus: 'UPDATED' },
            })
            const sale = {
                saleId: '1',
                vehicleId: 'v1',
                clientDocument: 'doc',
                saleDate: '2025-08-25',
                saleStatus: 'UPDATED',
                payment: { paymentLink: '', total: 100 },
            }
            const result = await repo.update('1', sale as Sale)
            expect(result.saleStatus).toBe('UPDATED')
        })

        it('listByStatus should return sorted vehicles', async () => {
            sendMock.mockResolvedValue({
                Items: [{ price: 200 }, { price: 100 }],
            })
            const result = await repo.listByStatus(true)
            expect(result[0].price).toBe(100)
            expect(result[1].price).toBe(200)
        })
    })
})
