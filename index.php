<?php
// index.php — My Location Unknown
// Entry point: detects the visitor's location via browser Geolocation API
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Location Unknown</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>📍 My Location Unknown</h1>
            <p class="subtitle">Discover and share where you are in the world.</p>
        </header>

        <main>
            <div id="location-card" class="card">
                <div id="status" class="status status-waiting">
                    <div class="spinner"></div>
                    <p>Waiting for your permission to access location…</p>
                </div>

                <div id="result" class="hidden">
                    <div class="coord-row">
                        <div class="coord-box">
                            <span class="coord-label">Latitude</span>
                            <span id="lat" class="coord-value">—</span>
                        </div>
                        <div class="coord-box">
                            <span class="coord-label">Longitude</span>
                            <span id="lng" class="coord-value">—</span>
                        </div>
                    </div>
                    <div class="coord-row">
                        <div class="coord-box">
                            <span class="coord-label">Accuracy</span>
                            <span id="acc" class="coord-value">—</span>
                        </div>
                    </div>

                    <div class="actions">
                        <a id="map-link" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                            🗺️ Open in Maps
                        </a>
                        <a id="share-link" href="#" class="btn btn-secondary">
                            🔗 Share My Location
                        </a>
                        <button id="copy-btn" class="btn btn-outline" onclick="copyShareLink()">
                            📋 Copy Link
                        </button>
                    </div>

                    <div id="copy-msg" class="copy-msg hidden">Link copied to clipboard!</div>
                </div>

                <div id="error" class="hidden error-box">
                    <p id="error-msg">Unable to retrieve location.</p>
                </div>
            </div>

            <div class="card info-card">
                <h2>How it works</h2>
                <ol>
                    <li>Click <strong>Allow</strong> when your browser asks for location permission.</li>
                    <li>Your coordinates are detected using your device's GPS or network data.</li>
                    <li>Use <em>Share My Location</em> to generate a link you can send to anyone.</li>
                    <li>Your location is <strong>never stored</strong> on any server — it lives in the URL only.</li>
                </ol>
            </div>
        </main>

        <footer>
            <p>My Location Unknown &mdash; runs on cPanel &bull; No data stored</p>
        </footer>
    </div>

    <script>
        (function () {
            var GEOLOCATION_TIMEOUT_MS = 10000;  // ms before geolocation request times out
        var COPY_MSG_DISPLAY_MS   = 2500;   // ms the "copied!" confirmation stays visible

        var statusEl  = document.getElementById('status');
            var resultEl  = document.getElementById('result');
            var errorEl   = document.getElementById('error');
            var errorMsg  = document.getElementById('error-msg');
            var latEl     = document.getElementById('lat');
            var lngEl     = document.getElementById('lng');
            var accEl     = document.getElementById('acc');
            var mapLink   = document.getElementById('map-link');
            var shareLink = document.getElementById('share-link');

            function showError(msg) {
                statusEl.classList.add('hidden');
                errorEl.classList.remove('hidden');
                errorMsg.textContent = msg;
            }

            function onSuccess(position) {
                var lat = position.coords.latitude.toFixed(6);
                var lng = position.coords.longitude.toFixed(6);
                var acc = Math.round(position.coords.accuracy) + ' m';

                latEl.textContent  = lat;
                lngEl.textContent  = lng;
                accEl.textContent  = acc;

                var mapsUrl  = 'https://www.google.com/maps?q=' + lat + ',' + lng;
                var shareUrl = window.location.origin + window.location.pathname.replace('index.php', '')
                             + 'share.php?lat=' + encodeURIComponent(lat)
                             + '&lng=' + encodeURIComponent(lng);

                mapLink.href   = mapsUrl;
                shareLink.href = shareUrl;
                shareLink.setAttribute('data-url', shareUrl);

                statusEl.classList.add('hidden');
                resultEl.classList.remove('hidden');
            }

            function onError(err) {
                var messages = {
                    1: 'Permission denied. Please allow location access and reload.',
                    2: 'Position unavailable. Check your device settings.',
                    3: 'Request timed out. Please try again.'
                };
                showError(messages[err.code] || 'An unknown error occurred.');
            }

            if (!navigator.geolocation) {
                showError('Geolocation is not supported by your browser.');
                return;
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onError, {
                enableHighAccuracy: true,
                timeout: GEOLOCATION_TIMEOUT_MS,
                maximumAge: 0
            });
        })();

        function copyShareLink() {
            var shareLink = document.getElementById('share-link');
            var url = shareLink.getAttribute('data-url') || shareLink.href;
            var copyMsg = document.getElementById('copy-msg');

            if (navigator.clipboard && url) {
                navigator.clipboard.writeText(url).then(function () {
                    copyMsg.classList.remove('hidden');
                    setTimeout(function () { copyMsg.classList.add('hidden'); }, COPY_MSG_DISPLAY_MS);
                });
            }
        }
    </script>
</body>
</html>
