function convertir() {
  const url = document.getElementById('videoUrl').value;
  const message = document.getElementById('message');
  const loading = document.getElementById('loading');
  message.classList.add('hidden');
  loading.classList.remove('hidden');

  if (!url.startsWith('https://www.youtube.com/') && !url.startsWith('https://youtu.be/')) {
    message.textContent = '❌ Veuillez entrer une URL YouTube valide.';
    message.classList.remove('hidden');
    loading.classList.add('hidden');
    return;
  }

  // Détection réseau local
  const hostname = window.location.hostname;
  let baseUrl;

  const isLocal = (
    hostname === 'localhost' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    /^172\.(1[6-9]|2[0-9]|3[01])\./.test(hostname)
  );

  if (isLocal) {
    baseUrl = 'http://192.168.1.11:5555';
  } else {
    baseUrl = 'http://109.130.147.120:8888';
  }

  const lien = `${baseUrl}/convert?url=${encodeURIComponent(url)}`;

  window.open(lien);

  setTimeout(() => {
    loading.classList.add('hidden');
    message.textContent = '✅ Conversion lancée, le téléchargement va commencer.';
    message.classList.remove('hidden');
  }, 2000);
}
      function generateMatrix() {
      const matrix = document.getElementById("matrix");
      const columns = Math.floor(window.innerWidth / 20);
      const codeLines = [
  "あ", "い", "う", "え", "お",  // Hiragana
  "か", "き", "く", "け", "こ",
  "さ", "し", "す", "せ", "そ",
  "タ", "チ", "ツ", "テ", "ト",  // Katakana
  "ナ", "ニ", "ヌ", "ネ", "ノ",
  "一", "二", "三", "人", "日",  // Kanji
  "山", "川", "水", "火", "木"
];
      for (let i = 0; i < columns; i++) {
        const column = document.createElement("div");
        column.className = "matrix-column";
        column.innerText = Array(30).fill(0).map(() => codeLines[Math.floor(Math.random() * codeLines.length)]).join("\n");
        column.style.position = "absolute";
        column.style.left = `${i * 20}px`;
        column.style.animationDuration = `${2 + Math.random() * 10}s`;
        matrix.appendChild(column);
      }
    }

    window.addEventListener("load", generateMatrix);
    window.addEventListener("resize", () => {
      document.getElementById("matrix").innerHTML = "";
      generateMatrix();
    });