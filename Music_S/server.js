import express from 'express';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import pLimit from 'p-limit';
import { pipeline } from 'stream';
import { PassThrough } from 'stream';

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const PORT = 5555;

// File de traitement (2 simultanés max)
const limit = pLimit(2);

app.get('/convert', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send('❌ URL manquante.');

  console.log(`[+] Requête convert reçue pour URL : ${videoUrl}`);

  // Limiter la conversion
  limit(async () => {
    try {
      const info = await ytdl.getInfo(videoUrl);
      const title = info.videoDetails.title.replace(/[\\/:*?"<>|]/g, '_').substring(0, 50);
      const filename = `${title}.mp3`;

      const audioStream = ytdl(videoUrl, { quality: 'highestaudio' });
      const ffmpegStream = new PassThrough();

      ffmpeg(audioStream)
        .setFfmpegPath(ffmpegPath)
        .format('mp3')
        .audioCodec('libmp3lame')
        .on('error', err => {
          console.error('❌ Erreur de conversion :', err);
          res.status(500).send('Erreur pendant la conversion.');
        })
        .pipe(ffmpegStream);

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'audio/mpeg');

      ffmpegStream.pipe(res);
    } catch (err) {
      console.error('❌ Erreur récupération infos :', err);
      res.status(500).send('Erreur lors de la récupération de la vidéo.');
    }
  })();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
