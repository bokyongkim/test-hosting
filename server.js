// Static HTML server. Weather fetched client-side to keep server simple & stable.
const http = require('http');

const PORT = process.env.PORT || 3000;

const HTML = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Seoul 날씨</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
         background: linear-gradient(135deg,#74b9ff,#0984e3); color:#fff;
         min-height:100vh; margin:0; display:flex; align-items:center; justify-content:center; }
  .card { background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);
          padding:40px 60px; border-radius:20px; text-align:center;
          box-shadow:0 8px 32px rgba(0,0,0,0.2); min-width:280px; }
  h1 { margin:0 0 10px; font-size:2rem; }
  .temp { font-size:4rem; font-weight:700; margin:20px 0; }
  .desc { font-size:1.5rem; margin-bottom:20px; }
  .meta { font-size:0.95rem; opacity:0.85; }
  .meta div { margin:4px 0; }
  .loading { opacity:0.7; }
</style>
</head>
<body>
  <div class="card">
    <h1>Seoul</h1>
    <div id="desc" class="desc loading">로딩 중…</div>
    <div id="temp" class="temp">--°C</div>
    <div class="meta">
      <div>습도: <span id="hum">--</span>%</div>
      <div>풍속: <span id="wind">--</span> m/s</div>
      <div>업데이트: <span id="time">--</span></div>
    </div>
  </div>
<script>
const CODE = {0:"맑음 ☀️",1:"대체로 맑음 🌤️",2:"부분적으로 흐림 ⛅",3:"흐림 ☁️",
  45:"안개 🌫️",48:"짙은 안개 🌫️",51:"약한 이슬비 🌦️",53:"이슬비 🌦️",55:"강한 이슬비 🌧️",
  61:"약한 비 🌧️",63:"비 🌧️",65:"강한 비 🌧️",71:"약한 눈 🌨️",73:"눈 🌨️",75:"강한 눈 ❄️",
  80:"소나기 🌦️",81:"강한 소나기 🌧️",82:"매우 강한 소나기 ⛈️",95:"천둥번개 ⛈️"};
fetch("https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.978&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto")
  .then(r => r.json())
  .then(d => {
    const c = d.current;
    document.getElementById("desc").textContent = CODE[c.weather_code] || ("코드 " + c.weather_code);
    document.getElementById("desc").classList.remove("loading");
    document.getElementById("temp").textContent = c.temperature_2m + "°C";
    document.getElementById("hum").textContent = c.relative_humidity_2m;
    document.getElementById("wind").textContent = c.wind_speed_10m;
    document.getElementById("time").textContent = c.time;
  })
  .catch(e => {
    document.getElementById("desc").textContent = "날씨 정보를 가져오지 못했습니다";
  });
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    return res.end();
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(HTML);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Weather page running on 0.0.0.0:' + PORT);
});
