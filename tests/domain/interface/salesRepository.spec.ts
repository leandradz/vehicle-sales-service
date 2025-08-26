import { SalesRepository } from '../../../src/domain/interface/salesRepository'

describe('SalesRepository Interface', () => {
    it('should define create, update, and get methods', () => {
        const repo: SalesRepository = {
            create: jest.fn(),
            update: jest.fn(),
            get: jest.fn(),
        }
        expect(typeof repo.create).toBe('function')
        expect(typeof repo.update).toBe('function')
        expect(typeof repo.get).toBe('function')
    })
})
