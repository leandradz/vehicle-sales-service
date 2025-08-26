import { Payment } from './payment'

export class Sale {
    constructor(
        public saleId: string,
        public vehicleId: string,
        public clientDocument: string,
        public saleDate: string,
        public saleStatus: string,
        public payment: Payment
    ) {
        this.saleId = saleId
        this.vehicleId = vehicleId
        this.clientDocument = clientDocument
        this.saleDate = saleDate
        this.saleStatus = saleStatus
        this.payment.paymentLink = payment.paymentLink
        this.payment.total = payment.total
    }
}
