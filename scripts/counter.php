$jsonString = file_get_contents('visitorCounter.json');
$data = json_decode($jsonString, true);

$newJsonString = json_encode($data);
file_put_contents('visitorCounter.json', $newJsonString);