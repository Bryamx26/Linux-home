import express from 'express';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import pLimit from 'p-limit';
import { PassThrough } from 'stream';

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const PORT = 5555;

// Limite à 2 conversions en parallèle
const limit = pLimit(2);

app.get('/convert', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send('❌ URL manquante.');

  console.log(`[+] Requête convert reçue pour URL : ${videoUrl}`);

  try {
    // Utilisation de p-limit avec await
    await limit(async () => {
      const info = await ytdl.getInfo(videoUrl);
      const title = info.videoDetails.title.replace(/[\\/:*?"<>|]/g, '_').substring(0, 50);
      const filename = `${title}.mp3`;

      const audioStream = ytdl(videoUrl, { quality: 'highestaudio' });
      const ffmpegStream = new PassThrough();

      ffmpeg(audioStream)
        .format('mp3')
        .audioCodec('libmp3lame')
        .on('error', err => {
          console.error('❌ Erreur de conversion :', err);
          if (!res.headersSent) res.status(500).send('Erreur pendant la conversion.');
        })
        .pipe(ffmpegStream);

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'audio/mpeg');

      ffmpegStream.pipe(res);
    });
  } catch (err) {
    console.error('❌ Erreur récupération infos ou conversion :', err);
    if (!res.headersSent) res.status(500).send('Erreur lors de la récupération ou conversion.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
