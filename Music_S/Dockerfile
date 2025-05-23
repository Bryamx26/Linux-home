# Utiliser une image Node officielle
FROM node:18

# Installer ffmpeg (essentiel pour ton projet)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Créer un dossier de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json (si tu en as)
COPY package*.json ./

# Installer les dépendances Node.js
RUN npm install

# Copier le reste du code source
COPY . .

# Créer un dossier temp (optionnel si tu le fais dans le code)
RUN mkdir -p temp

# Exposer le port sur lequel ton app écoute
EXPOSE 5555

# Lancer ton serveur
CMD ["node", "server.js"]
