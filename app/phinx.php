<?php

require_once __DIR__ . '/bootstrap/app.php';

return [
    'paths' => [
        'migrations' => '%%PHINX_CONFIG_DIR%%/database/migrations',
        'seeds' => '%%PHINX_CONFIG_DIR%%/database/seeds'
    ],
    'environments' => [
        'default_migration_table' => 'migrations',
        'default_environment' => 'default',
        'default' => [
            'adapter' => 'mysql',
            'host' => 'mysql',
            'name' => 'upcehosting',
            'user' => 'root',
            'pass' => 'rootpass',
            'port' => '3306',
            'charset' => 'utf8mb4',
        ]
    ],
    'version_order' => 'creation'
];
