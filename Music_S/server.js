const express = require('express');
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5555;



const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

app.get('/convert', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send('❌ URL manquante.');
   console.log(`[+] Requête convert reçue pour URL : ${videoUrl}`);
  try {
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title.replace(/[\\/:*?"<>|]/g, '_').substring(0, 50);
    const outputPath = path.join(TEMP_DIR, `${title}.mp3`);

    const stream = ytdl(videoUrl, { filter: 'audioonly' });

    ffmpeg(stream)
      .audioCodec('libmp3lame')
      .toFormat('mp3')
      .on('error', err => {
        console.error('❌ Erreur de conversion :', err);
        res.status(500).send('❌ Erreur de conversion.');
      })
      .on('end', () => {
        console.log(`✅ Conversion terminée : ${outputPath}`);
        res.download(outputPath, `${title}.mp3`, err => {
          if (err) console.error(err);
          fs.unlink(outputPath, () => {
            console.log(`🗑️ Fichier temporaire supprimé : ${outputPath}`);
          });
        });
      })
      .save(outputPath);

  } catch (err) {
    console.error('❌ Erreur lors de la récupération des infos :', err);
    res.status(500).send('❌ Impossible de récupérer les infos vidéo.');
  }
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


app.listen(PORT,'0.0.0.0', () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
