const restaurants = [
  // ここにあなたの店舗データそのまま貼る
];

// --- Leaflet 初期化 ---
const map = L.map('map').setView([33.558,133.536], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution:'&copy; OpenStreetMap contributors'
}).addTo(map);

const markers = L.markerClusterGroup().addTo(map);

let currentDay = 0;
let currentHour = 12;

const dayNames = ["月","火","水","木","金","土","日"];

function updateMarkers(){
  markers.clearLayers();

  restaurants.forEach(r => {
    const todayList = r.hours.filter(h => h[0] === currentDay);
    if(todayList.length === 0) return;

    const isOpen = todayList.some(h => currentHour >= h[1] && currentHour < h[2]);
    if(!isOpen) return;

    let hoursText = "";
    todayList.forEach(h => {
      const sH = Math.floor(h[1]), sM = h[1] % 1 ? "30":"00";
      const eH = Math.floor(h[2]), eM = h[2] % 1 ? "30":"00";
      hoursText += `${dayNames[h[0]]} ${sH}:${sM}〜${eH}:${eM}<br>`;
    });

    const popup = `<b>${r.name}</b><br>営業中<br>${hoursText}`;
    const m = L.marker([r.lat,r.lng]).bindPopup(popup);
    markers.addLayer(m);
  });
}

document.getElementById('time-slider').addEventListener('input', e=>{
  currentHour = parseFloat(e.target.value);
  const hr = Math.floor(currentHour);
  const mn = currentHour % 1 ? "30":"00";
  document.getElementById('time-label').textContent = `時間: ${hr}:${mn}`;
  updateMarkers();
});

document.querySelectorAll('.weekday-buttons button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.weekday-buttons button')
      .forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentDay = parseInt(btn.dataset.day);
    updateMarkers();
  });
});

updateMarkers();
