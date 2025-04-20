<?php
namespace Worker;

use App\Hosting\Status;
use App\Models\Database;

class DatabaseManager {

    public static function createDatabase($args) {
        $conn = $args['db']->getConnection();

        $dbName = $args['domain'] . "_" . $args['tld'];
        $dbUser = $args['domain'] . $args['tld'];
        $password = self::generatepassword();

        try {
            // 1. Создаём базу данных
            $conn->statement("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");

            // 2. Создаём пользователя (или обновляем пароль, если он уже есть)
            $conn->statement("CREATE USER IF NOT EXISTS '$dbUser'@'%' IDENTIFIED BY '$password';");
            $conn->statement("ALTER USER '$dbUser'@'%' IDENTIFIED WITH mysql_native_password BY '$password';");

            // 3. Выдаём права пользователю только на его базу
            $conn->statement("GRANT ALL PRIVILEGES ON `$dbName`.* TO '$dbUser'@'%';");

            // 4. Применяем все изменения
            $conn->statement("FLUSH PRIVILEGES;");

            // 5. Обновляем статус и пароль в таблице databases
            Database::where([
                ['domain', '=', $args['domain']],
                ['tld', '=', $args['tld']]
            ])->update([
                'status' => Status::Running->value,
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
