import { VehicleRepository } from '../../domain/interface/vehicleRepository'
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
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'Vehicles'

export class DynamoVehicleRepository implements VehicleRepository {
    async create(vehicle: Vehicle): Promise<Vehicle> {
        const vehicleData = {
            ...vehicle,
            id: crypto.randomUUID(),
            isAvailable: false,
        }

        const params = {
            TableName: TABLE_NAME,
            Item: vehicleData,
        }
        await ddbDocClient.send(new PutCommand(params))
        return vehicleData
    }

    async get(vehicleId: string): Promise<Vehicle | null> {
        const params = {
            TableName: TABLE_NAME,
            Key: { id: vehicleId },
        }
        const result = await ddbDocClient.send(new GetCommand(params))
        return result.Item ? (result.Item as Vehicle) : null
    }

    async update(
        vehicleId: string,
        vehicle: Partial<Vehicle>
    ): Promise<Vehicle> {
        const updateExp: string[] = []
        const expAttrValues: Record<string, any> = {}
        for (const key in vehicle) {
            if (key === 'id') continue // Não atualize a chave primária!
            updateExp.push(`${key} = :${key}`)
            expAttrValues[`:${key}`] = vehicle[key as keyof Vehicle]
        }
        const params = {
            TableName: TABLE_NAME,
            Key: { id: vehicleId },
            UpdateExpression: `set ${updateExp.join(', ')}`,
            ExpressionAttributeValues: expAttrValues,
            ReturnValues: 'ALL_NEW' as const,
        }
        const result = await ddbDocClient.send(new UpdateCommand(params))
        return result.Attributes as Vehicle
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
