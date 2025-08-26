import QRCode from 'qrcode'
import { Sale } from '../../domain/entities/sale'

export class MercadoPagoController {
    async getUserToken(): Promise<{ token: string; userId: number } | null> {
        const url = `${process.env.MERCADO_PAGO_API}/oauth/token`
        const data = {
            client_secret: process.env.MERCADO_PAGO_CLIENT_SECRET,
            client_id: process.env.MERCADO_PAGO_CLIENT_ID,
            grant_type: 'client_credentials',
            test_token: 'true',
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            const result = (await response.json()) as {
                token_type: string
                access_token: string
                user_id: number
            }
            return {
                token: `${result.token_type} ${result.access_token}`,
                userId: result.user_id,
            }
        } catch (error) {
            console.error('Failed to fetch auth token:', error)
            throw new Error('Failed to fetch Mercado Pago Token')
        }
    }

    async generateQRCodeLink(
        accessData: { token: string; userId: number },
        sale: Sale
    ): Promise<{ qr_data: string }> {
        const url = `${process.env.MERCADO_PAGO_QR_CODE_API}/${accessData.userId}/pos/Loja1/qrs`
        const NOTIFICATION_URL = `${process.env.MERCADO_PAGO_WEBHOOK}/payment/webhook`
        const data = {
            external_reference: sale.saleId,
            title: 'Vehicle sale',
            description: 'Vehicle sale data',
            notification_url: NOTIFICATION_URL,
            total_amount: sale.payment.total,
            items: [
                {
                    sku_number: sale.vehicleId,
                    category: 'marketplace',
                    title: `Compra de veículo n° ${sale.saleId}`,
                    description: `Compra do veículo n° ${sale.vehicleId}`,
                    unit_price: sale.payment.total,
                    unit_measure: 'unit',
                    total_amount: sale.payment.total,
                    quantity: 1,
                },
            ],
        }
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: accessData.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            const result = (await response.json()) as { qr_data: string }
            if (!result.qr_data) {
                throw new Error('Mercado Pago API did not return qr_data')
            }
            return { qr_data: result.qr_data }
        } catch (error) {
            console.error('Failed to generate QR Code Link:', error)
            throw new Error('Failed to generate QR code link')
        }
    }

    async convertQRCodeToImage(qrData: string): Promise<string> {
        return new Promise((resolve, reject) => {
            QRCode.toDataURL(qrData, (err: unknown, url: string) => {
                if (err) {
                    reject(new Error('Failed to generate QR Code Image'))
                } else {
                    resolve(url)
                }
            })
        })
    }

    async getPaymentStatus(
        url: string
    ): Promise<{ id: string; status: string } | null> {
        try {
            const authData = await this.getUserToken()
            if (!authData?.token) throw new Error('Failed to fetch token')

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: authData?.token,
                    'Content-Type': 'application/json',
                },
            })
            const result = (await response.json()) as {
                external_reference: string
                order_status: string
            }
            return {
                id: result.external_reference,
                status: result.order_status,
            }
        } catch (error) {
            console.error('Failed to generate QR Code Link:', error)
            throw new Error('Failed to generate QR code link')
        }
    }
}
