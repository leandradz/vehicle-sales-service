import { Payment } from '../../../src/domain/entities/payment'

describe('Payment Entity', () => {
    it('should create a payment with correct properties', () => {
        const payment = new Payment('http://payment.link', 1000)
        expect(payment.paymentLink).toBe('http://payment.link')
        expect(payment.total).toBe(1000)
    })
})
