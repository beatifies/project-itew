<?php
require __DIR__.'/vendor/autoload.php';

$uri = 'mongodb+srv://austriaabcde17_db_user:Hs3g1pm25%21@test-cluster.fsnao09.mongodb.net/student_profiling?appName=test-cluster&tls=true&tlsAllowInvalidCertificates=false';
$client = new \MongoDB\Client($uri);
$db = $client->selectDatabase('student_profiling');
$users = $db->selectCollection('users');

$admin = $users->findOne(['email' => 'admin@ccs.edu']);
var_dump($admin);
