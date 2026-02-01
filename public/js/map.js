document.addEventListener("DOMContentLoaded", () => {

  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  const city = mapDiv.dataset.location;

  const map = L.map("map").setView([20.5937, 78.9629], 5); // India center

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  if (!city) return;

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) return;

      const lat = data[0].lat;
      const lon = data[0].lon;

      map.setView([lat, lon], 12);

      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(city)
        .openPopup();
    });

});
