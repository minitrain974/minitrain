/* ===== main.js – πλήρης έκδοση =====
   • toggle POI sidebar
   • InfoWindow (όνομα) σε κάθε marker
   • κουμπί Καθαρισμός
   • POI-checkboxes + user markers + συνολική απόσταση
   • single-click = marker, double-click = zoom (χωρίς marker)
   =================================== */

   let map;
   let directionsService;
   let directionsRenderer;
   
   const routeMarkers  = [];   // όλοι οι markers (user + ενεργοί POIs) με τη σειρά που μπήκαν
   const poiMarkerRefs = {};   // poiId → marker
   
   const RED_PIN = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
   
   /* ──────────── ΚΑΘΑΡΙΣΜΟΣ ──────────── */
   function clearRoute() {
     routeMarkers.forEach(m => m.setMap(null));
     routeMarkers.length = 0;
   
     Object.values(poiMarkerRefs).forEach(m => m.setMap(null));
     for (const id in poiMarkerRefs) delete poiMarkerRefs[id];
   
     document.querySelectorAll('#poi-list input[type="checkbox"]')
             .forEach(cb => (cb.checked = false));
   
     document.getElementById('points-list').innerHTML = '';
     document.getElementById('total-distance').textContent =
       'Συνολική Απόσταση: 0 km';
   
     directionsRenderer.set('directions', null);
   }
   
   /* ──────────── INIT ──────────── */
   function initMap() {
     map = new google.maps.Map(document.getElementById('map'), {
       center: { lat: 38.291584, lng: 21.793645 },
       zoom: 16,
       mapTypeId: google.maps.MapTypeId.ROADMAP,
       zoomControl: true,
       zoomControlOptions: {
         style: google.maps.ZoomControlStyle.LARGE,
         position: google.maps.ControlPosition.BOTTOM_CENTER
       },
       language: 'el'
     });
   
     directionsService  = new google.maps.DirectionsService();
     directionsRenderer = new google.maps.DirectionsRenderer({
       map,
       suppressMarkers: true
     });
   
     /* κουμπιά */
     const toggle = togglePoiSidebar;
     document.getElementById('toggle-poi-btn').onclick = toggle;
     document.getElementById('close-poi').onclick      = toggle;
     document.getElementById('clear-btn').onclick      = clearRoute;
   
     /* checkbox POIs */
     document.querySelectorAll('#poi-list input[type="checkbox"]').forEach(cb => {
       cb.addEventListener('change', () => {
         const id = +cb.dataset.poiId;
         cb.checked ? addPoiMarker(id) : removePoiMarker(id);
       });
     });
   
     /* single-click για marker | double-click για zoom (χωρίς marker) */
     let singleClickTimer;
     map.addListener('click', (e) => {
       singleClickTimer = setTimeout(() => addUserMarker(e.latLng), 250);
     });
     map.addListener('dblclick', () => {
       clearTimeout(singleClickTimer);   // ακυρώνει την προσθήκη marker
     });
   }
   
   /* ──────────── TOGGLE SIDEBAR ──────────── */
   function togglePoiSidebar() {
     const sb = document.getElementById('poi-sidebar');
     sb.style.width = sb.style.width === '250px' ? '0' : '250px';
   }
   
   /* ──────────── POI MARKERS ──────────── */
   function addPoiMarker(id) {
     if (poiMarkerRefs[id]) return;
     const poi = POIS.find(p => p.id === id);
     if (!poi) return;
   
     const marker = new google.maps.Marker({
       position: { lat: poi.lat, lng: poi.lng },
       map,
       title: poi.name,
       icon: poi.icon
     });
     marker.__type  = 'poi';
     marker.__poiId = id;
   
     const iw = new google.maps.InfoWindow({ content: poi.name });
     iw.open(map, marker);
     marker.addListener('click', () => iw.open(map, marker));
   
     poiMarkerRefs[id] = marker;
     routeMarkers.push(marker);
     updatePointList();
     updateRoute();
   }
   
   function removePoiMarker(id) {
     const m = poiMarkerRefs[id];
     if (!m) return;
     m.setMap(null);
     delete poiMarkerRefs[id];
   
     const i = routeMarkers.indexOf(m);
     if (i > -1) routeMarkers.splice(i, 1);
   
     updatePointList();
     updateRoute();
   }
   
   /* ──────────── USER MARKERS ──────────── */
   function addUserMarker(latLng) {
     const userIdx = routeMarkers.filter(m => m.__type === 'user').length + 1;
     const title   = `Σημείο ${userIdx}`;
   
     const marker = new google.maps.Marker({
       position: latLng,
       map,
       title,
       icon: RED_PIN
     });
     marker.__type = 'user';
   
     const iw = new google.maps.InfoWindow({ content: title });
     iw.open(map, marker);
     marker.addListener('click', () => iw.open(map, marker));
   
     marker.addListener('rightclick', () => removeUserMarker(marker));
     marker.addListener('dblclick',   () => removeUserMarker(marker));
   
     routeMarkers.push(marker);
     updatePointList();
     updateRoute();
   }
   
   function removeUserMarker(marker) {
     const i = routeMarkers.indexOf(marker);
     if (i > -1) routeMarkers.splice(i, 1);
     marker.setMap(null);
     updatePointList();
     updateRoute();
   }
   
   /* ──────────── UI HELPERS ──────────── */
   function updatePointList() {
     const ul = document.getElementById('points-list');
     ul.innerHTML = '';
   
     routeMarkers.forEach(m => {
       const li = document.createElement('li');
       li.textContent = m.__type === 'user' ? m.getTitle()
                                            : `POI: ${m.getTitle()}`;
       li.onclick = () => { map.panTo(m.getPosition()); map.setZoom(16); };
   
       const del = document.createElement('button');
       del.textContent = '✖';
       del.className   = 'del-btn';
       del.onclick = e => {
         e.stopPropagation();
         m.__type === 'user'
           ? removeUserMarker(m)
           : (document.querySelector(`#poi-list input[data-poi-id="${m.__poiId}"]`).checked = false,
              removePoiMarker(m.__poiId));
       };
   
       li.appendChild(del);
       ul.appendChild(li);
     });
   }
   
   function updateRoute() {
     if (routeMarkers.length < 2) {
       directionsRenderer.set('directions', null);
       document.getElementById('total-distance').textContent =
         'Συνολική Απόσταση: 0 km';
       return;
     }
   
     const origin      = routeMarkers[0].getPosition();
     const destination = routeMarkers.at(-1).getPosition();
     const waypoints   = routeMarkers.slice(1, -1)
                         .map(m => ({ location: m.getPosition(), stopover: true }));
   
     directionsService.route(
       { origin, destination, waypoints,
         travelMode: google.maps.TravelMode.DRIVING },
       (res, status) => {
         if (status !== 'OK') return console.error(status);
         directionsRenderer.setDirections(res);
   
         const meters = res.routes[0].legs.reduce((s, l) => s + l.distance.value, 0);
         document.getElementById('total-distance').textContent =
           `Συνολική Απόσταση: ${(meters / 1000).toFixed(2)} km`;
       }
     );
   }
   