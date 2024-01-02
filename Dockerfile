FROM node:alpine-18

RUN npm install

COPY . .

EXPOSE 8080