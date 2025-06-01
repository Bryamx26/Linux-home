FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json s'ils existent
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers de l'application
COPY . .

# Exposer le port utilisé par Express
EXPOSE 5555

# Lancer le serveur avec support des modules ES
CMD ["node", "--enable-source-maps", "server.js"]
