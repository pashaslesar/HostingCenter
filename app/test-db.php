<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;
use Worker\DatabaseManager;

// Подключение к MySQL через Capsule
$capsule = new Capsule();
$capsule->addConnection([
    'driver'    => 'mysql',
    'host'      => 'mysql', // имя сервиса в docker-compose
    'database'  => 'upcehosting',
    'username'  => 'user',
    'password'  => 'password',
    'charset'   => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix'    => ''
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

// Имитация данных из очереди
$args = [
    'domain' => 'demo',
    'tld' => 'cz',
    'db' => $capsule
];


try {
    DatabaseManager::createDatabase($args);
    echo "✅ База данных и пользователь успешно созданы.\n";
} catch (Exception $e) {
    echo "❌ Ошибка: " . $e->getMessage() . "\n";
}
