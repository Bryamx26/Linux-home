const express = require('express');
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const app = express(); // ✅ TU DOIS d'abord créer l'instance Express
const PORT = 5555;

app.get('/convert', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send('❌ URL manquante.');

  try {
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title.replace(/[\\/:*?"<>|]/g, '_').substring(0, 50);

    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`); 
    res.setHeader('Content-Type', 'audio/mpeg');

    const stream = ytdl(videoUrl, { filter: 'audioonly', highWaterMark: 1 << 25 });

    ffmpeg(stream)
      .audioCodec('libmp3lame')
      .format('mp3')
      .on('error', err => {
        console.error('❌ Erreur de conversion :', err);
        res.status(500).end('❌ Erreur de conversion.');
      })
      .pipe(res, { end: true });

  } catch (err) {
    console.error('❌ Erreur lors de la récupération des infos :', err);
    res.status(500).send('❌ Impossible de récupérer les infos vidéo.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
