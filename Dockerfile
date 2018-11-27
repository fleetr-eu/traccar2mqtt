FROM node:8-alpine

ADD . /app/

WORKDIR /app

RUN npm install --production

EXPOSE 80

ENTRYPOINT ["npm"]

CMD ["start"]
