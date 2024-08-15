# user-service/Dockerfile 
FROM node:20.9.0-alpine

# Install MySQL client
RUN apk add --no-cache mysql-client

WORKDIR /Spider-T2/user-service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
