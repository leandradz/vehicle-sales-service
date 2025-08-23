# TRABALHO SUB TECH CHALLENGE CURSO SOAT – PÓSTECH

[Apresentação FIAP - Reposição Fase 4]()

## Descrição do Projeto

Uma empresa de revenda de veículos automotores nos contratou pois quer implantar uma
plataforma que funcione na internet, sendo assim, temos que criar a plataforma. O time de UX já
está criando os designs, e ficou sob sua responsabilidade criar a API, para que posteriormente o
time de frontend integre a solução. O desenho da solução envolve as seguintes necessidades do
negócio.

## Estrutura do Projeto

-   **Backend**: Microsserviço utilizando arquitetura hexagonal.
-   **APIs Implementadas**:
    • Cadastrar um veículo para venda (Marca, modelo, ano, cor, preço);
    • Editar os dados do veículo;
    • Efetuar a venda de um veículo (CPF da pessoa que comprou e data da venda);
    • Disponibilizar um endpoint (webhook) para que a entidade que processa o pagamento
    consiga, a partir do código do pagamento, informar se o pagamento foi efetuado ou
    cancelado;
    • Listagem de veículos à venda, ordenada por preço, do mais barato para o mais caro;
    • Listagem de veículos vendidos, ordenada por preço, do mais barato para o mais caro.
-   **Banco de Dados**: DynamoDB (simulado localmente com LocalStack).

## Como Rodar o Projeto Localmente

Para iniciar o projeto, você precisará ter o Docker e o Docker Compose instalados. Siga os passos abaixo:

1. Clone o repositório:

<!-- ```bash
   git clone git@github.com:
   cd vehicle-manager-service
``` -->

2. Construa e inicie os containers:

```bash
    docker run -d -p 4566:4566 -e SERVICES=dynamodb --name localstack localstack/localstack:latest

    docker-compose up --build
```

3. Acesse a aplicação em http://localhost:3002

## Documentação da API

A documentação das APIs está disponível via Swagger. Após iniciar o projeto, você pode acessá-la em http://localhost:3002/api-docs.
