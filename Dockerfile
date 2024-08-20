FROM node:18-alpine

RUN mkdir transcendence
WORKDIR /transcendence

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "./frontend/app.js"]