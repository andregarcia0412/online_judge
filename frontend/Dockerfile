FROM node:20.19 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 5173