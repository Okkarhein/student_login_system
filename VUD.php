<?php
include "server.php";

if (isset($_GET['action']) && $_GET['action'] === 'getUsers') {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

    try {
        $result = $connection->query(
            "SELECT student_id, student_name, student_gender, student_email FROM student_register ORDER BY student_id DESC"
        );
    } catch (mysqli_sql_exception $exception) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database query failed: ' . $exception->getMessage()
        ]);
        exit;
    }

    if ($result === false) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Could not load student records.']);
        exit;
    }

    $students = [];
    while ($student = $result->fetch_assoc()) {
        $students[] = $student;
    }

    echo json_encode(['success' => true, 'users' => $students]);
    exit;
}

if (isset($_GET['action']) && $_GET['action'] === 'getUser' && isset($_GET['id'])) {
    header('Content-Type: application/json; charset=utf-8');

    $userId = (int) $_GET['id'];
    $statement = $connection->prepare(
        "SELECT student_id, student_name, student_gender, student_email FROM student_register WHERE student_id = ?"
    );
    $statement->bind_param("i", $userId);
    $statement->execute();
    $result = $statement->get_result();
    $student = $result->fetch_assoc();

    if ($student) {
        echo json_encode(['success' => true, 'user' => $student]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Student record not found.']);
    }
    exit;
}

if (isset($_GET['delete_id'])) {
    $userId = (int) $_GET['delete_id'];
    $statement = $connection->prepare("DELETE FROM student_register WHERE student_id = ?");
    $statement->bind_param("i", $userId);

    if ($statement->execute()) {
        header('Location: view%26edit.html');
    } else {
        http_response_code(500);
        echo "Could not delete the student record: " . $statement->error;
    }
    exit;
}

if (isset($_POST['update'])) {
    $userId = (int) $_POST['student_id'];
    $studentName = trim($_POST['student_name']);
    $studentGender = $_POST['student_gender'];
    $studentEmail = trim($_POST['student_email']);
    $studentPassword = $_POST['student_password'];

    if ($studentPassword !== '') {
        $statement = $connection->prepare(
            "UPDATE student_register SET student_name = ?, student_gender = ?, student_email = ?, student_password = ? WHERE student_id = ?"
        );
        $statement->bind_param(
            "ssssi",
            $studentName,
            $studentGender,
            $studentEmail,
            $studentPassword,
            $userId
        );
    } else {
        $statement = $connection->prepare(
            "UPDATE student_register SET student_name = ?, student_gender = ?, student_email = ? WHERE student_id = ?"
        );
        $statement->bind_param("sssi", $studentName, $studentGender, $studentEmail, $userId);
    }

    if ($statement->execute()) {
        header('Location: view%26edit.html');
    } else {
        http_response_code(500);
        echo "Could not update the student record: " . $statement->error;
    }
    exit;
}

header('Location: view%26edit.html');
