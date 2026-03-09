<?php
// share.php — My Location Unknown
// Displays a shared location passed via query-string parameters (?lat=…&lng=…).

// Degrees of latitude/longitude to pad around the shared point in the map embed.
const MAP_DELTA = 0.01;

// Sanitise and validate inputs
$lat = isset($_GET['lat']) ? trim($_GET['lat']) : '';
$lng = isset($_GET['lng']) ? trim($_GET['lng']) : '';

$valid = false;
$lat_f = 0.0;
$lng_f = 0.0;

if ($lat !== '' && $lng !== '') {
    $lat_f = (float) $lat;
    $lng_f = (float) $lng;

    // Basic range check
    if ($lat_f >= -90 && $lat_f <= 90 && $lng_f >= -180 && $lng_f <= 180) {
        $valid = true;
    }
}

$lat_safe = $valid ? htmlspecialchars(number_format($lat_f, 6), ENT_QUOTES, 'UTF-8') : '';
$lng_safe = $valid ? htmlspecialchars(number_format($lng_f, 6), ENT_QUOTES, 'UTF-8') : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shared Location &mdash; My Location Unknown</title>
    <!-- Open Graph tags for nice link previews -->
    <?php if ($valid): ?>
    <meta property="og:title"       content="Someone shared a location with you">
    <meta property="og:description" content="Lat: <?php echo $lat_safe; ?>, Lng: <?php echo $lng_safe; ?>">
    <meta property="og:type"        content="website">
    <?php endif; ?>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>📍 My Location Unknown</h1>
            <p class="subtitle">Someone has shared their location with you.</p>
        </header>

        <main>
            <?php if ($valid): ?>
            <div class="card">
                <h2>Shared Location</h2>

                <div class="coord-row">
                    <div class="coord-box">
                        <span class="coord-label">Latitude</span>
                        <span class="coord-value"><?php echo $lat_safe; ?></span>
                    </div>
                    <div class="coord-box">
                        <span class="coord-label">Longitude</span>
                        <span class="coord-value"><?php echo $lng_safe; ?></span>
                    </div>
                </div>

                <div class="actions">
                    <a href="https://www.google.com/maps?q=<?php echo urlencode($lat_safe . ',' . $lng_safe); ?>"
                       target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                        🗺️ Open in Google Maps
                    </a>
                    <a href="https://maps.apple.com/?q=<?php echo urlencode($lat_safe . ',' . $lng_safe); ?>"
                       target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                        🍎 Open in Apple Maps
                    </a>
                </div>

                <!-- Embedded map using OpenStreetMap (no API key required) -->
                <div class="map-embed">
                    <iframe
                        title="Shared location on OpenStreetMap"
                        loading="lazy"
                        src="https://www.openstreetmap.org/export/embed.html?bbox=<?php
                            echo urlencode(($lng_f - MAP_DELTA) . ',' . ($lat_f - MAP_DELTA) . ',' . ($lng_f + MAP_DELTA) . ',' . ($lat_f + MAP_DELTA));
                        ?>&amp;layer=mapnik&amp;marker=<?php echo urlencode($lat_f . ',' . $lng_f); ?>"
                        allowfullscreen>
                    </iframe>
                </div>

                <p class="note">
                    <a href="index.php">← Find my own location</a>
                </p>
            </div>
            <?php else: ?>
            <div class="card">
                <div class="error-box">
                    <p>No valid location was provided in this link.</p>
                </div>
                <p class="note"><a href="index.php">← Go to home page</a></p>
            </div>
            <?php endif; ?>
        </main>

        <footer>
            <p>My Location Unknown &mdash; runs on cPanel &bull; No data stored</p>
        </footer>
    </div>
</body>
</html>
