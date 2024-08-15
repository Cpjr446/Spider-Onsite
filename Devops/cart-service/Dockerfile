# cart-service/Dockerfile
FROM node:20.9.0-alpine

# Install MySQL client
RUN apk add --no-cache mysql-client

WORKDIR /Spider-T2/cart-service

COPY package*.json ./

RUN npm install express

COPY . .

EXPOSE 3002

CMD ["node", "server.js"]