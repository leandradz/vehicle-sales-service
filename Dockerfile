FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install -g wait-port
RUN npm install

COPY scripts/createTable.js /app/scripts/createTable.js
COPY src ./src

EXPOSE 3001

CMD ["sh", "-c", "wait-port localstack:4566 && node /app/scripts/createTable.js && npm start"]