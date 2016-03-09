FROM node:slim

ADD . /app/

WORKDIR /app

RUN npm install

EXPOSE 4000

CMD node index.js
