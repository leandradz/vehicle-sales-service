import { Sale } from '../../../src/domain/entities/sale'
import { Payment } from '../../../src/domain/entities/payment'

describe('Sale Entity', () => {
    it('should create a sale with correct properties', () => {
        const payment = new Payment('http://payment.link', 2000)
        const sale = new Sale(
            'sale-1',
            'vehicle-1',
            '12345678900',
            '2025-08-25',
            'completed',
            payment
        )
        expect(sale.saleId).toBe('sale-1')
        expect(sale.vehicleId).toBe('vehicle-1')
        expect(sale.clientDocument).toBe('12345678900')
        expect(sale.saleDate).toBe('2025-08-25')
        expect(sale.saleStatus).toBe('completed')
        expect(sale.payment.paymentLink).toBe('http://payment.link')
        expect(sale.payment.total).toBe(2000)
    })
})
