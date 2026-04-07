// Simple Node.js weather page using Open-Meteo (no API key required)
const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;

// Default: Seoul
const DEFAULT_LAT = 37.5665;
const DEFAULT_LON = 126.9780;
const DEFAULT_CITY = 'Seoul';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

const WEATHER_CODE = {
  0: '맑음 ☀️',
  1: '대체로 맑음 🌤️',
  2: '부분적으로 흐림 ⛅',
  3: '흐림 ☁️',
  45: '안개 🌫️',
  48: '짙은 안개 🌫️',
  51: '약한 이슬비 🌦️',
  53: '이슬비 🌦️',
  55: '강한 이슬비 🌧️',
  61: '약한 비 🌧️',
  63: '비 🌧️',
  65: '강한 비 🌧️',
  71: '약한 눈 🌨️',
  73: '눈 🌨️',
  75: '강한 눈 ❄️',
  80: '소나기 🌦️',
  81: '강한 소나기 🌧️',
  82: '매우 강한 소나기 ⛈️',
  95: '천둥번개 ⛈️',
};

function renderPage(city, weather) {
  const c = weather.current;
  const desc = WEATHER_CODE[c.weather_code] || `코드 ${c.weather_code}`;
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${city} 날씨</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
         background: linear-gradient(135deg,#74b9ff,#0984e3); color:#fff;
         min-height:100vh; margin:0; display:flex; align-items:center; justify-content:center; }
  .card { background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);
          padding:40px 60px; border-radius:20px; text-align:center;
          box-shadow:0 8px 32px rgba(0,0,0,0.2); }
  h1 { margin:0 0 10px; font-size:2rem; }
  .temp { font-size:4rem; font-weight:700; margin:20px 0; }
  .desc { font-size:1.5rem; margin-bottom:20px; }
  .meta { font-size:0.95rem; opacity:0.85; }
  .meta div { margin:4px 0; }
</style>
</head>
<body>
  <div class="card">
    <h1>${city}</h1>
    <div class="desc">${desc}</div>
    <div class="temp">${c.temperature_2m}°C</div>
    <div class="meta">
      <div>체감온도: 계산 안 함</div>
      <div>습도: ${c.relative_humidity_2m}%</div>
      <div>풍속: ${c.wind_speed_10m} m/s</div>
      <div>업데이트: ${c.time}</div>
    </div>
  </div>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    return res.end();
  }
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${DEFAULT_LAT}&longitude=${DEFAULT_LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
    const weather = await fetchJSON(url);
    const html = renderPage(DEFAULT_CITY, weather);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('날씨 정보를 가져오지 못했습니다: ' + e.message);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Weather page running on 0.0.0.0:${PORT}`);
});
