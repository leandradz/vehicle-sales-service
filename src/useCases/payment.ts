import { SalesRepository } from '../domain/interface/salesRepository'
import { MercadoPagoController } from '../drivers/web/mercadoPagoController'
import { Sale } from '../domain/entities/sale'
import { STATUS } from '../constants/status'

export class PaymentUseCase {
    private readonly mercadoPagoController: MercadoPagoController
    private readonly salesRepository: SalesRepository

    constructor(
        mercadoPagoController: MercadoPagoController,
        salesRepository: SalesRepository
    ) {
        this.mercadoPagoController = mercadoPagoController
        this.salesRepository = salesRepository
    }

    async createPayment(saleId: string): Promise<Sale> {
        if (!saleId) {
            throw new Error('Sale ID is required')
        }

        const existingSale = await this.salesRepository.get(saleId)
        if (!existingSale) {
            throw new Error(`Sale with ID ${saleId} does not exist`)
        }
        const accessData = await this.mercadoPagoController.getUserToken()

        if (!accessData?.token || !accessData?.userId) {
            throw new Error('Failed to fetch QR code token')
        }

        const qrCodeLink = (await this.mercadoPagoController.generateQRCodeLink(
            accessData,
            existingSale
        )) as { qr_data: string }

        const QRCodePaymentLink =
            await this.mercadoPagoController.convertQRCodeToImage(
                qrCodeLink.qr_data
            )

        const saleUpdated = await this.salesRepository.update(
            existingSale.saleId,
            {
                saleStatus: STATUS.AWAITING_PAYMENT,
                payment: {
                    ...existingSale.payment,
                    paymentLink: QRCodePaymentLink,
                },
            }
        )

        return saleUpdated
    }

    async getPayment(saleId: string): Promise<Sale | null> {
        const sale = await this.salesRepository.get(saleId)
        if (!sale) {
            throw new Error('Sale not found')
        }
        return sale
    }

    async handlePaymentWebhook(webhookData: {
        resource: string
        topic: string
    }): Promise<void> {
        if (webhookData.topic !== 'merchant_order') {
            console.warn('Invalid webhook topic:', webhookData.topic)
            return
        }

        const mercadoPagoData =
            await this.mercadoPagoController.getPaymentStatus(
                webhookData.resource
            )

        if (!mercadoPagoData?.id || !mercadoPagoData?.status) {
            throw new Error('Invalid MercadoPago data')
        }

        const paymentId = mercadoPagoData.id
        const paymentStatus = mercadoPagoData.status.toUpperCase()
        await this.salesRepository.update(paymentId, {
            saleStatus: paymentStatus,
        })
    }
}
