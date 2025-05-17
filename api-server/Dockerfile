FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3000

EXPOSE 9092

CMD ["npm", "run", "dev"]
