FROM node:16-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5555

CMD ["node", "server.js"]
