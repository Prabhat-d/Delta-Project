
let map = L.map('map').setView([28.6139, 77.2090], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


L.marker([coordinates[1], coordinates[0]])
    .addTo(map)
    .bindPopup(`<h4>${title}</h4><p>Exact location will be provided after booking.</p>`)
    .openPopup();

L.circleMarker([coordinates[1], coordinates[0]], {
    radius : 100,
    color : "red",
    fillColor : "red",
    fillOpacity : 0.1,
}).addTo(map);