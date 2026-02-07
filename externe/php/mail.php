<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

header('Content-Type: application/json');

$authUsername = 'you@example.com';
$authPassword = 'password';
$authHost = 'smtp.gmail.com';

$name = $_POST['name'] ?? 'Test Name';
$subject = $_POST['subject'] ?? 'Test mail';
$email = $_POST['email'] ?? $authUsername;
$message = $_POST['message'] ?? 'Test Message';
$sendTo = 'send@example.com';

$mail = new PHPMailer(true);

$mail->isSMTP();
$mail->Host       = $authHost;
$mail->SMTPAuth   = true;
$mail->Username   = $authUsername;
$mail->Password   = $authPassword;
$mail->SMTPSecure = 'tls';
$mail->Port       = 587;

if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $mail->addReplyTo($email, $name);
}

$mail->setFrom($authUsername, $name);
$mail->addAddress($sendTo);

$mail->Subject = $subject;
$mail->Body    = $message;

try {
    $mail->send();
    echo json_encode(['status' => 'ok']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'error' => $mail->ErrorInfo]);
}