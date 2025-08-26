import { DynamoSalesRepository } from '../../../src/drivers/database/salesModel'

describe('DynamoSalesRepository', () => {
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
})
