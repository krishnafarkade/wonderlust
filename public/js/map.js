// Get data passed from EJS
const lat = mapData.lat;
const lng = mapData.lng;
const place = mapData.place;

// Initialize map
var map = L.map('map').setView([lat, lng], 10);

// Add tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add marker
L.marker([lat, lng])
  .addTo(map)
  .bindPopup(place)
  .openPopup();
