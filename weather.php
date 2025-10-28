
<?php
header("Access-Control-Allow-Origin: *"); // allow fetch from any origin
header("Content-Type: application/json");

// Check city
if (empty($_GET['city'])) {
    echo json_encode(["cod" => 400, "message" => "City not provided"]);
    exit;
}

$city = urlencode($_GET['city']);
$apiKey = ""; // your OpenWeatherMap API key
$url = "https://api.openweathermap.org/data/2.5/weather?q=$city&appid=$apiKey&units=metric";

// Use cURL for fetching
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10); // 10 seconds timeout
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Handle fetch errors
if ($response === false) {
    echo json_encode(["cod" => 500, "message" => "Failed to fetch weather"]);
    exit;
}

// Decode JSON
$data = json_decode($response, true);

// Normalize cod to integer for JS comparison
if (isset($data['cod'])) {
    $data['cod'] = (int)$data['cod'];
} else {
    $data['cod'] = 500;
    $data['message'] = "Unknown error";
}

echo json_encode($data);
?>
