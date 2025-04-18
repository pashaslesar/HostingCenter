<?php
require __DIR__ . "/../vendor/autoload.php";

use Illuminate\Database\Capsule\Manager as Capsule;
use Predis\Client;

$capsule = new Capsule();
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

$redis = new Client("tcp://redis:6379?read_write_timeout=0");

$logFile = '/var/log/upcehosting.log';
if (!file_exists(dirname($logFile))) {
    mkdir(dirname($logFile), 0777, true);
}

echo "🔥 Воркер запущен\n";
echo "⌛ Ждём задачу из Redis...\n";

while (true) {
    try {
        $request = $redis->blpop('queue', 0);
        echo "📥 Получена задача из Redis\n";

        $data = json_decode($request[1], true);
        $operation = $data['operation'];
        $args = $data['args'];
        $args['db'] = $capsule;

        echo "🔧 Выполняем: " . json_encode($operation) . "\n";

        if (is_string($operation) && str_contains($operation, '::')) {
            $operationParts = explode('::', $operation);
            $result = call_user_func_array($operationParts, [$args]);
        } else {
            $result = call_user_func_array($operation, [$args]);
        }

        echo "✅ Выполнено успешно!\n";

        $log_string = json_encode([
            '✅ SUCCESS' => true,
            'operation' => $operation,
            'args' => $args,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } catch (Throwable $e) {
        echo "❌ Ошибка: " . $e->getMessage() . "\n";
        $log_string = json_encode([
            '❌ ERROR' => $e->getMessage(),
            'operation' => $operation ?? 'UNKNOWN',
            'args' => $args ?? [],
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }

    file_put_contents($logFile, $log_string . "\n", FILE_APPEND);
}
