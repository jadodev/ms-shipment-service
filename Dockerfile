FROM node:22-alpine

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["yarn", "dev"]
