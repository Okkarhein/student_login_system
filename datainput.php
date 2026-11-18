<?php
header("Content-Type: application/json; charset=utf-8");

function sendJsonResponse($statusCode, $success, $message)
{
    http_response_code($statusCode);
    echo json_encode([
        "success" => $success,
        "message" => $message
    ]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST" || !isset($_POST["submit"])) {
    sendJsonResponse(400, false, "Please submit the registration form.");
}

$requiredFields = [
    "student_name",
    "student_gender",
    "student_email",
    "student_password"
];

foreach ($requiredFields as $field) {
    if (!isset($_POST[$field]) || $_POST[$field] === "") {
        sendJsonResponse(400, false, "Please complete all fields.");
    }
}

$studentName = trim($_POST["student_name"]);
$studentGender = $_POST["student_gender"];
$studentEmail = trim($_POST["student_email"]);
$studentPassword = $_POST["student_password"];

try {
    include "server.php";

    $statement = $connection->prepare(
        "INSERT INTO student_register (student_name, student_gender, student_email, student_password) VALUES (?, ?, ?, ?)"
    );
    if ($statement === false) {
        sendJsonResponse(500, false, "Database error: " . $connection->error);
    }

    $statement->bind_param(
        "ssss",
        $studentName,
        $studentGender,
        $studentEmail,
        $studentPassword
    );

    if (!$statement->execute()) {
        sendJsonResponse(500, false, "Database error: " . $statement->error);
    }

    $statement->close();
    $connection->close();
    sendJsonResponse(200, true, "New record created successfully.");
} catch (mysqli_sql_exception $exception) {
    sendJsonResponse(500, false, "Database error: " . $exception->getMessage());
}
?>
