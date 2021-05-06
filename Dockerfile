FROM node:14-alpine

WORKDIR /workdir

COPY app/package.json ./

RUN npm install

COPY app/app.js ./app.js

EXPOSE 8080

CMD ["node", "app.js"]