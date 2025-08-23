import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

export class DynamoConnection {
    private static instance: DynamoConnection
    private readonly client: DynamoDBClient
    private readonly region: string = process.env.AWS_REGION || 'us-east-1'
    private readonly endpoint: string =
        process.env.DYNAMODB_ENDPOINT || 'http://localhost:4566'

    private constructor() {
        this.client = new DynamoDBClient({
            region: this.region,
            endpoint: this.endpoint,
        })
    }

    public static getInstance(): DynamoConnection {
        if (!DynamoConnection.instance) {
            DynamoConnection.instance = new DynamoConnection()
        }
        return DynamoConnection.instance
    }

    public getClient(): DynamoDBClient {
        return this.client
    }
}
