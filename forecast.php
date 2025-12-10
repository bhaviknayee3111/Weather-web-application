<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (empty($_GET['city'])) {
    echo json_encode(["cod" => "400", "message" => "City not provided"]);
    exit;
}

$city = urlencode($_GET['city']);
$apiKey = "";// your API key
$url = ";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
curl_close($ch);

if ($response === false) {
    echo json_encode(["cod" => "500", "message" => "Failed to fetch forecast"]);
    exit;
}

echo $response;
?>
