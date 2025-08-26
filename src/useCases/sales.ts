import { SalesRepository } from '../domain/interface/salesRepository'
import { VehicleServicePort } from '../domain/interface/vehicleServicePort'
import crypto from 'crypto'
import { STATUS } from '../constants/status'
import { Sale } from '../domain/entities/sale'
export class SalesUseCase {
    private readonly salesRepository: SalesRepository
    private readonly vehicleService: VehicleServicePort

    constructor(
        salesRepository: SalesRepository,
        vehicleService: VehicleServicePort
    ) {
        this.salesRepository = salesRepository
        this.vehicleService = vehicleService
    }

    async findById(saleId: string): Promise<Sale | null> {
        const sale = await this.salesRepository.get(saleId)
        if (!sale) {
            throw new Error('Sale not found')
        }
        return sale
    }

    async create(
        vehicleId: string,
        clientDocument: string
    ): Promise<Sale | null> {
        const existingVehicle = await this.vehicleService.findById(vehicleId)
        if (!existingVehicle) {
            throw new Error('Vehicle does not exist in vehicle-manager-service')
        }

        const saleId = crypto.randomUUID()
        const createdSale = await this.salesRepository.create({
            vehicleId,
            clientDocument,
            saleId,
            saleDate: new Date().toISOString(),
            saleStatus: STATUS.REQUEST_RECEIVED,
            payment: {
                paymentLink: '',
                total: existingVehicle.price,
            },
        })
        if (!createdSale) {
            throw new Error('Failed to create sale')
        }
        const updatedVehicle = await this.vehicleService.update(
            existingVehicle.id,
            {
                ...existingVehicle,
                saleId: createdSale.saleId,
                isAvailable: false,
                saleDate: createdSale.saleDate,
                clientDocument,
            }
        )

        if (!updatedVehicle) {
            throw new Error('Failed to fetch updated vehicle with sale')
        }
        return createdSale
    }

    async update(sale: Sale): Promise<Sale | null> {
        const updatedSale = await this.salesRepository.update(sale.saleId, sale)
        if (!updatedSale) {
            throw new Error('Failed to update sale')
        }

        if (updatedSale.saleStatus === STATUS.CANCELLED) {
            await this.vehicleService.update(updatedSale.vehicleId, {
                saleId: '',
                isAvailable: true,
            })
        }

        return updatedSale
    }
}
