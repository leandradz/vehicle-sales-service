import { Sale } from '../entities/sale'

export interface SalesRepository {
    create(sale: Sale): Promise<Sale>
    update(saleId: string, sale: Sale): Promise<Sale>
    get(saleId: string): Promise<Sale | null>
}
