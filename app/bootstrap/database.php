<?php
use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule($container);
$capsule->addConnection([
    'driver'    => 'mysql',
    'host'      => 'mysql', 
    'database'  => 'upcehosting',
    'username'  => 'user',
    'password'  => 'password',
    'charset'   => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix'    => ''
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();
