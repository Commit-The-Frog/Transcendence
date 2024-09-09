# 베이스 이미지로 Node.js 사용
FROM node:16

# 작업 디렉토리 설정
RUN mkdir /frontend
WORKDIR /frontend

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3001

# 명령어 설정
CMD ["npm", "start"]
