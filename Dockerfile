FROM node:16.2.0 AS server-build
WORKDIR /usr/src/app
COPY . .
RUN npm install

EXPOSE 3081

CMD ["node", "./server.js"]