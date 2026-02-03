// 高知市の実在店舗サンプル（緯度経度は中心付近の目安）
const stores = [
  { name:"利他食堂", lat:33.5609, lng:133.5321, hours:{Mon:[17,23],Tue:[17,23],Wed:[17,23],Thu:[17,23],Fri:[17,23],Sat:[17,23],Sun:[17,23]}},
  { name:"一期人会 とうふ家", lat:33.5728, lng:133.5308, hours:{Mon:[11,15],Tue:[11,15],Wed:[11,15],Thu:[11,15],Fri:[11,15],Sat:[11,15],Sun:[11,15]}},
  { name:"産地処 樹樹", lat:33.5622, lng:133.5338, hours:{Mon:[17,22],Tue:[17,22],Wed:[17,22],Thu:[17,22],Fri:[17,22],Sat:[17,22],Sun:[17,22]}},
  { name:"居酒屋 うめ丸", lat:33.5595, lng:133.5369, hours:{Mon:[17,24],Tue:[17,24],Wed:[17,24],Thu:[17,24],Fri:[17,24],Sat:[17,24],Sun:[17,24]}},
  { name:"居酒屋 お箸の国", lat:33.5597, lng:133.5372, hours:{Mon:[17,23],Tue:[17,23],Wed:[17,23],Thu:[17,23],Fri:[17,23],Sat:[17,23],Sun:[17,23]}},
  { name:"居酒屋本舗 KARB・カーブ", lat:33.5591, lng:133.5375, hours:{Mon:[18,24],Tue:[18,24],Wed:[18,24],Thu:[18,24],Fri:[18,24],Sat:[18,24],Sun:[18,24]}},
  { name:"居酒屋 よいち", lat:33.5589, lng:133.5381, hours:{Mon:[18,23],Tue:[18,23],Wed:[18,23],Thu:[18,23],Fri:[18,23],Sat:[18,23],Sun:[18,23]}},
  { name:"追手筋宴舞堂", lat:33.5590, lng:133.5349, hours:{Mon:[12,25],Tue:[12,25],Wed:[12,25],Thu:[12,25],Fri:[12,26],Sat:[12,26],Sun:[12,25]}},
  { name:"海鮮居酒屋 龍馬屋", lat:33.5587, lng:133.5390, hours:{Mon:[18,21],Tue:[18,21],Wed:[18,21],Thu:[18,21],Fri:[18,21],Sat:[18,21],Sun:[18,21]}},
  { name:"海鮮料理 海ぼうず", lat:33.5588, lng:133.5350, hours:{Mon:[11,22],Tue:[11,22],Wed:[11,22],Thu:[11,22],Fri:[11,22],Sat:[11,22],Sun:[11,22]}},
  { name:"池澤鮮魚", lat:33.5720, lng:133.5350, hours:{Mon:[8,17],Tue:[8,17],Wed:[8,17],Thu:[8,17],Fri:[8,17],Sat:[8,17],Sun:[8,17]}},
  { name:"彩菜創食 もと", lat:33.5710, lng:133.5345, hours:{Mon:[17,25],Tue:[17,25],Wed:[17,25],Thu:[17,25],Fri:[17,25],Sat:[17,25],Sun:[17,25]}},
  { name:"菊寿し別館", lat:33.5712, lng:133.5328, hours:{Mon:[11,17],Tue:[11,17],Wed:[11,17],Thu:[11,17],Fri:[11,17],Sat:[11,17],Sun:[11,17]}},
  { name:"高知サンライズホテル ASAHI", lat:33.5725, lng:133.5360, hours:{Mon:[11,21],Tue:[11,21],Wed:[11,21],Thu:[11,21],Fri:[11,21],Sat:[11,21],Sun:[11,21]}},
  { name:"高知会館 レストラン", lat:33.5715, lng:133.5370, hours:{Mon:[11,21],Tue:[11,21],Wed:[11,21],Thu:[11,21],Fri:[11,21],Sat:[11,21],Sun:[11,21]}},
  { name:"個室居酒屋 鬼瓦ふ", lat:33.5708, lng:133.5342, hours:{Mon:[17,24],Tue:[17,24],Wed:[17,24],Thu:[17,24],Fri:[17,24],Sat:[17,24],Sun:[17,24]}},
  // 以下をマップ内にもっと追加したい場合は同じ形式で増やせます
];
  
// マップ初期化
const map = L.map('map').setView([33.56,133.53],14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:'&copy; OpenStreetMap contributors'
}).addTo(map);

// MarkerCluster
const markersCluster = L.markerClusterGroup();
map.addLayer(markersCluster);

// マーカー生成
const markers = stores.map(store=>{
  const marker = L.circleMarker([store.lat,store.lng],{
    radius:8,color:'blue',fillColor:'blue',fillOpacity:0.7
  });
  marker.store = store;
  marker.addTo(markersCluster);
  return marker;
});

// 曜日/時間選択
let selectedDay = 'Mon';
let selectedHour = 12;

// マーカー更新
function updateMarkers(){
  markers.forEach(marker=>{
    const hrs = marker.store.hours[selectedDay];
    const open = hrs && selectedHour>=hrs[0] && selectedHour<hrs[1];
    if(open){
      marker.setStyle({opacity:1,fillOpacity:0.7});
      const start = hrs[0].toString().padStart(2,'0');
      const endHour = hrs[1]>24 ? hrs[1]-24 : hrs[1];
      const end = endHour.toString().padStart(2,'0');
      marker.bindPopup(`<b>${marker.store.name}</b><br>営業時間: ${start}:00〜${end}:00`);
    } else {
      marker.setStyle({opacity:0,fillOpacity:0});
    }
  });
  document.getElementById('time-label').textContent = `時間: ${selectedHour}:00`;
  document.body.classList.toggle('night-mode', selectedHour>=20 || selectedHour<6);
}

// UI イベント
document.querySelectorAll('.weekday-buttons button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.weekday-buttons button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    selectedDay = btn.dataset.day;
    updateMarkers();
  });
});

document.getElementById('time-slider').addEventListener('input', e=>{
  selectedHour = parseInt(e.target.value);
  updateMarkers();
});

// 初回描画
updateMarkers();
