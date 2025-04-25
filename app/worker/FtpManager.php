<?php
namespace Worker;
use Exception;

class FtpManager {

    const VIRTUAL_USERS = "/etc/vsftpd/virtual_users";

    // public static function addRecord($username, $password) {
    //     // some checks
    //     // echo "myuser:$(openssl passwd -1 newpass)" >> /etc/vsftpd/virtual_users
    //     // $salt = openssl_random_pseudo_bytes(6);
    //     // $hash = '$1$' . base64_encode($salt) . '$' . openssl_digest($salt . $password, 'md5');
    //     $returnValue = null;
    //     $hash = array();
    //     exec("openssl passwd -1 $password", $hash, $returnValue);
    //     $handle = fopen(self::VIRTUAL_USERS, "a");
    //     if (flock($handle, LOCK_EX)) {
    //         // probably should test config
    //         // also should probably backup before writing
    //         fwrite($handle, "$username:".$hash[0]."\n");
    //         flock($handle, LOCK_UN);
    //     } else {
    //         throw new Exception("COULD_NOT_GET_FILE_ACCESS");
    //         echo "could not get access";
    //     }
    // }

    // public static function addRecord($username, $password) {
    //     $command = escapeshellcmd("setup_ftp_user.sh $username $password");
    //     $output = [];
    //     $returnCode = 0;
    //     file_put_contents('/var/log/ftp_debug.log', "👤 Создаю FTP для $login\n", FILE_APPEND);
    //     exec($command, $output, $returnCode);
    
    //     if ($returnCode !== 0) {
    //         throw new Exception("Failed to create FTP user: " . implode("\n", $output));
    //     }
    // }

    // public static function addRecord(string $username, string $password): void {
    //     $logPath = "/var/log/upcehosting.log";
    //     file_put_contents($logPath, "📥 FtpManager::addRecord($username)\n", FILE_APPEND);
    
    //     try {
    //         $userDir = "/etc/vsftpd/vusers/$username";
    
    //         if (!file_exists(dirname($userDir))) {
    //             mkdir(dirname($userDir), 0777, true);
    //             file_put_contents($logPath, "📂 Создана директория vusers\n", FILE_APPEND);
    //         }
    
    //         $conf = "local_root=/var/www/$username\nwrite_enable=YES\n";
    //         file_put_contents($userDir, $conf);
    //         file_put_contents($logPath, "📄 Конфиг для пользователя $username записан\n", FILE_APPEND);
    
    //         // Добавим в virtual_users
    //         $accountsFile = "/etc/vsftpd/virtual_users";
    //         $entry = "$username\n$password\n";
    //         file_put_contents($accountsFile, $entry, FILE_APPEND);
    //         file_put_contents($logPath, "🔐 Добавлена запись в virtual_users для $username\n", FILE_APPEND);
    
    //         // Перегенерируем db файл
    //         exec("db_load -T -t hash -f $accountsFile /etc/vsftpd/virtual_users.db 2>&1", $output, $ret);
    //         file_put_contents($logPath, "🔃 Обновление virtual_users.db, код возврата: $ret, вывод: " . implode("\n", $output) . "\n", FILE_APPEND);
    
    //         if ($ret !== 0) {
    //             throw new \Exception("Ошибка при db_load: " . implode(" | ", $output));
    //         }
    
    //         file_put_contents($logPath, "✅ FTP-пользователь $username успешно создан\n", FILE_APPEND);
    //     } catch (\Throwable $e) {
    //         file_put_contents($logPath, "❌ FtpManager ошибка: " . $e->getMessage() . "\n", FILE_APPEND);
    //         throw new \Exception("Failed to create FTP user: " . $e->getMessage());
    //     }
    // }
    
    public static function addRecord(string $username, string $password): void {
        $logPath = "/var/log/upcehosting.log";
        file_put_contents($logPath, "📥 FtpManager::addRecord($username)\n", FILE_APPEND);
    
        try {
            $escapedUser = escapeshellarg($username);
            $escapedPass = escapeshellarg($password);
            $cmd = "/usr/local/bin/setup_ftp_user.sh $escapedUser $escapedPass";
    
            file_put_contents($logPath, "🔧 Вызов setup_ftp_user.sh: $cmd\n", FILE_APPEND);
            exec($cmd . " 2>&1", $output, $ret);
    
            file_put_contents($logPath, "📄 Вывод: " . implode("\n", $output) . "\n", FILE_APPEND);
            file_put_contents($logPath, "💥 Код возврата: $ret\n", FILE_APPEND);
    
            if ($ret !== 0) {
                throw new \Exception("Ошибка при создании FTP пользователя. Код: $ret");
            }
    
            file_put_contents($logPath, "✅ FTP-пользователь $username успешно создан через скрипт\n", FILE_APPEND);
        } catch (\Throwable $e) {
            file_put_contents($logPath, "❌ FtpManager ошибка: " . $e->getMessage() . "\n", FILE_APPEND);
            throw new \Exception("Failed to create FTP user: " . $e->getMessage());
        }
    }
        

    public static function findRecord($args) {
    }

    public static function removeRecord($args) {
    }
}