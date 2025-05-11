function initMap() {
    var mapOptions = {
        center: { lat: 38.291584, lng: 21.793645 },
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,  // Ενεργοποίηση κουμπιών zoom
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,  // Είδος κουμπιών: LARGE ή SMALL
            position: google.maps.ControlPosition.TOP_LEFT  // Θέση κουμπιών (π.χ., πάνω αριστερά)
        },
        language: 'el'
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    const points = {};
    const markers = [];
    const routeRenderers = [];

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    directionsRenderer.setMap(map);

    // Click πάνω στον χάρτη
    google.maps.event.addListener(map, 'click', function (e) {
        const latLng = e.latLng;
        const pointName = `Point ${Object.keys(points).length + 1}`;

        const marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: pointName
        });
        markers.push(marker);

        const infowindow = new google.maps.InfoWindow({
            content: pointName
        });
        infowindow.open(map, marker);

        points[pointName] = {
            lat: latLng.lat(),
            lng: latLng.lng()
        };
    });

    // Checkboxes για σχολεία
    document.querySelectorAll('.points-list input').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            updateMapWithSelectedSchools();
        });
    });

    function updateMapWithSelectedSchools() {
        document.querySelectorAll('.points-list input:checked').forEach(function (checkbox) {
            const schoolName = checkbox.value;
            const latLng = getSchoolLatLng(schoolName);

            const marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: schoolName
            });
            markers.push(marker);

            const infowindow = new google.maps.InfoWindow({
                content: schoolName
            });
            infowindow.open(map, marker);

            points[schoolName] = {
                lat: latLng.lat,
                lng: latLng.lng
            };
        });
    }

    function getSchoolLatLng(schoolName) {
        const schoolLocations = {
            "Πρυτανεία": { lat: 38.28630743461042, lng: 21.786857202805194 },
            "Πάρκο Ειρήνης": { lat: 38.287309565453135, lng: 21.786567524237217 },
            "Φοιτητική Εστία": { lat: 38.2862471, lng: 21.7897895 },
            "Συνεδριακό & Πολιτιστικό Κέντρο": { lat: 38.2902906124496, lng: 21.786245659199214 },
            "Βιβλιοθήκη & Κέντρο Πληροφόρησης": { lat: 38.28977693795404, lng: 21.79117019485482 },
            "Μουσείο Επιστημών και Τεχνολογίας": { lat: 38.288016943625315, lng: 21.784689977948272 },
            "Τμήμα Μηχανολόγων και Αεροναυπηγών Μηχανικών": { lat: 38.28949062600148, lng: 21.78749020415793 },
            "Τμήμα Πολιτικών Μηχανικών": { lat: 38.289187470938245, lng: 21.790880516286844 },
            "Τμήμα Μηχανικών Η/Υ και Πληροφορικής": { lat: 38.29040008359405, lng: 21.795719221403743 },
            "Τμήμα Ηλεκτρολόγων Μηχανικών και Τεχνολογίας Υπολογιστών": { lat: 38.28862326227145, lng: 21.788724020333586 },
        };
        return schoolLocations[schoolName] || { lat: 38.291584, lng: 21.793645 };
    }

    // Κουμπί υπολογισμού MST
    document.getElementById('calculate').onclick = function () {
        const pointsArray = Object.values(points);

        if (pointsArray.length < 2) {
            alert('Please add at least two points to calculate the MST.');
            return;
        }

        calculateAndDrawRoutes(pointsArray, function (distances) {
            fetch('/calculate_mst', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ distances: distances })
            })
                .then(response => response.json())
                .then(data => {
                    // Clear previous MST
                    routeRenderers.forEach(r => r.setMap(null));
                    routeRenderers.length = 0;

                    data.forEach(edge => {
                        drawRoute(edge.start, edge.end);
                    });
                });
        });
    };

    function calculateAndDrawRoutes(pointsArray, callback) {
        const distances = [];
        let completedRequests = 0;

        for (let i = 0; i < pointsArray.length; i++) {
            for (let j = i + 1; j < pointsArray.length; j++) {
                getRouteDistance(pointsArray[i], pointsArray[j], function (result) {
                    distances.push(result);
                    completedRequests++;
                    if (completedRequests === (pointsArray.length * (pointsArray.length - 1)) / 2) {
                        callback(distances);
                    }
                });
            }
        }
    }

    function getRouteDistance(start, end, callback) {
        const origin = new google.maps.LatLng(start.lat, start.lng);
        const destination = new google.maps.LatLng(end.lat, end.lng);

        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            language: 'el'
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                const distance = response.routes[0].legs[0].distance.value;
                // Εμφάνιση κατευθύνσεων στην UI
                displayDirections(response);
                callback({
                    start: start,
                    end: end,
                    distance: distance,
                    response: response
                });
            } else {
                console.error('Directions request failed due to ' + status);
            }
        });
    }

    function displayDirections(response) {
        // Clear previous directions
        const directionsContent = document.getElementById('directions-content');
        directionsContent.innerHTML = ''; // Clear existing content

        const route = response.routes[0];
        let directionsText = `<strong>Απόσταση: ${route.legs[0].distance.text}</strong><br><br>`;

        route.legs[0].steps.forEach(function (step, index) {
            directionsText += `<p>${index + 1}. ${step.instructions}</p>`;
        });

        directionsContent.innerHTML = directionsText;
    }

    function drawRoute(start, end) {
        const origin = new google.maps.LatLng(start.lat, start.lng);
        const destination = new google.maps.LatLng(end.lat, end.lng);

        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            language: 'el'
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                const display = new google.maps.DirectionsRenderer({
                    map: map,
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: 'red',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    }
                });
                display.setDirections(response);
                routeRenderers.push(display);
            } else {
                console.error('Directions request failed due to ' + status);
            }
        });
    }

    // ➕ ΕΠΑΝΑΦΟΡΑ
    document.getElementById('reset').addEventListener('click', function () {
        // Clear map
        clearMap();

        // Clear checkboxes
        document.querySelectorAll('.points-list input').forEach(cb => cb.checked = false);

        // Clear points
        for (let key in points) delete points[key];

        // Clear previous directions
        const directionsContent = document.getElementById('directions-content');
        directionsContent.innerHTML = ''; // Clear existing content
    });

    // ⭐ Clear all markers and routes
    function clearMap() {
        markers.forEach(m => m.setMap(null));
        markers.length = 0;

        routeRenderers.forEach(r => r.setMap(null));
        routeRenderers.length = 0;
    }
}

// Φόρτωση όταν έτοιμο
document.addEventListener("DOMContentLoaded", function () {
    initMap();
});


