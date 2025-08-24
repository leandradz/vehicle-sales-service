export class Sale {
    constructor(
        public saleId: string,
        public vehicleId: string,
        public clientDocument: string,
        public saleDate: string,
        public saleStatus: string
    ) {
        this.saleId = saleId
        this.vehicleId = vehicleId
        this.clientDocument = clientDocument
        this.saleDate = saleDate
        this.saleStatus = saleStatus
    }
}
