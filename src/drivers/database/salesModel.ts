import { SalesRepository } from '../../domain/interface/salesRepository'
import { Sale } from '../../domain/entities/sale'
import { Vehicle } from '../../domain/entities/vehicle'
import { DynamoConnection } from '../../config/dynamoConfig'
import {
    DynamoDBDocumentClient,
    PutCommand,
    UpdateCommand,
    GetCommand,
    ScanCommand,
} from '@aws-sdk/lib-dynamodb'
import crypto from 'crypto'

const client = DynamoConnection.getInstance().getClient()
const ddbDocClient = DynamoDBDocumentClient.from(client)
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'Sales'

export class DynamoSalesRepository implements SalesRepository {
    async create(sale: Sale): Promise<Sale> {
        const saleData = {
            ...sale,
            saleId: sale.saleId || crypto.randomUUID(),
        }
        const params = {
            TableName: TABLE_NAME,
            Item: saleData,
        }
        await ddbDocClient.send(new PutCommand(params))
        return saleData
    }

    async get(saleId: string): Promise<Sale | null> {
        const params = {
            TableName: TABLE_NAME,
            Key: { saleId },
        }
        const result = await ddbDocClient.send(new GetCommand(params))
        return result.Item ? (result.Item as Sale) : null
    }

    async update(saleId: string, sale: Sale): Promise<Sale> {
        const updateExp: string[] = []
        const expAttrValues: Record<string, unknown> = {}
        for (const key in sale) {
            if (key === 'saleId') continue
            updateExp.push(`${key} = :${key}`)
            expAttrValues[`:${key}`] = sale[key as keyof typeof sale]
        }
        const params = {
            TableName: TABLE_NAME,
            Key: { saleId },
            UpdateExpression: `set ${updateExp.join(', ')}`,
            ExpressionAttributeValues: expAttrValues,
            ReturnValues: 'ALL_NEW' as const,
        }
        const result = await ddbDocClient.send(new UpdateCommand(params))
        return result.Attributes as Sale
    }

    async listByStatus(isAvailable: boolean): Promise<Vehicle[]> {
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: 'isAvailable = :isAvailable',
            ExpressionAttributeValues: { ':isAvailable': isAvailable },
        }
        const result = await ddbDocClient.send(new ScanCommand(params))
        const items = (result.Items || []) as Vehicle[]
        return items.sort((a, b) => a.price - b.price)
    }
}
