FROM node:18

WORKDIR /app

COPY serv.js .

RUN npm init -y && npm install

EXPOSE 3000

CMD ["node", "serv.js"]
