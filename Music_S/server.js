const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const pLimit = require('p-limit');
const stream = require('stream');

const app = express();
const PORT = 5555;

ffmpeg.setFfmpegPath(ffmpegPath);

const limit = pLimit(2); // max 2 conversions simultanées

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/convert', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send('❌ URL manquante.');
  console.log(`[+] Requête reçue : ${videoUrl}`);

  // File d’attente avec p-limit
  limit(() => handleStreaming(videoUrl, res)).catch(err => {
    console.error('❌ Erreur file de traitement :', err);
    res.status(500).send('❌ Erreur serveur.');
  });
});

async function handleStreaming(videoUrl, res) {
  try {
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title.replace(/[\\/:*?"<>|]/g, '_').substring(0, 50);

    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    const audioStream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });

    ffmpeg(audioStream)
      .audioCodec('libmp3lame')
      .format('mp3')
      .on('error', err => {
        console.error('❌ Erreur ffmpeg :', err.message);
        res.status(500).send('❌ Erreur conversion.');
      })
      .pipe(res, { end: true });

    console.log(`🎧 Streaming de : ${title}`);
  } catch (err) {
    console.error('❌ Erreur traitement vidéo :', err.message);
    res.status(500).send('❌ Vidéo non valide ou inaccessible.');
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`);
});
