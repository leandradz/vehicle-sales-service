const {
    DynamoDBClient,
    CreateTableCommand,
} = require('@aws-sdk/client-dynamodb')

console.log('Iniciando script de criação de tabela...')

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:4566',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
    },
})

const params = {
    TableName: process.env.DYNAMODB_TABLE || 'Vehicles',
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    BillingMode: 'PAY_PER_REQUEST',
}

async function createTable() {
    try {
        await client.send(new CreateTableCommand(params))
        console.log('Tabela criada com sucesso!')
    } catch (err) {
        if (err.name === 'ResourceInUseException') {
            console.log('Tabela já existe.')
        } else {
            console.error('Erro ao criar tabela:', err)
            process.exit(1)
        }
    }
}

createTable()
