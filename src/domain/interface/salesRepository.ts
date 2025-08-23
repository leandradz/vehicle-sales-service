import { Sale } from '../entities/sale'

export interface SalesRepository {
    create(sale: Sale): Promise<Sale>
    update(id: string, sale: Sale): Promise<Sale>
    get(id: string): Promise<Sale | null>
}
