FROM node:22-alpine

RUN mkdir /frontend
WORKDIR /frontend

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]