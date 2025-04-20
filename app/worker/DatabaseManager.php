<?php
namespace Worker;

use App\Hosting\Status;
use App\Models\Database;

class DatabaseManager {

    public static function createDatabase($args) {
        $dbName = $args['domain'] . "_" . $args['tld'];
        $dbUser = $args['domain'] . $args['tld'];
        $password = self::generatepassword();
    
        try {
            $pdo = new \PDO("mysql:host=mysql;port=3306;charset=utf8mb4", 'root', 'rootpass');
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    
            // 1. Создание базы
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    
            // 2. Создание пользователя
            $pdo->exec("CREATE USER IF NOT EXISTS '$dbUser'@'%' IDENTIFIED BY '$password';");
            $pdo->exec("ALTER USER '$dbUser'@'%' IDENTIFIED WITH mysql_native_password BY '$password';");
    
            // 3. Права
            $pdo->exec("GRANT ALL PRIVILEGES ON `$dbName`.* TO '$dbUser'@'%';");
            $pdo->exec("FLUSH PRIVILEGES;");
    
            // 4. Обновление записи в таблице databases через Eloquent
            \App\Models\Database::where([
                ['domain', '=', $args['domain']],
                ['tld', '=', $args['tld']]
            ])->update([
                'status' => \App\Hosting\Status::Running->value,
                'db' => $password
            ]);
    
            echo "✅ База данных '$dbName' успешно создана для пользователя '$dbUser'!\n";
            return true;
    
        } catch (\Exception $e) {
            echo "❌ Ошибка создания базы данных: " . $e->getMessage() . "\n";
            return false;
        }
    }
    

    public static function generatepassword(): string {
        $randomInt = random_int(0, pow(36, 8) - 1);
        $randomString = base_convert($randomInt, 10, 36);
        return str_pad($randomString, 8, '0', STR_PAD_LEFT);
    }
}
