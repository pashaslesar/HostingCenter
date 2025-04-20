<?php
namespace Worker;

use App\Hosting\Status;
use App\Models\Hosting;
use Exception;

class HttpManager {

    public static function refreshServer(): bool {
        $returnValue = null;
        $output = array();
        exec("nginx -t", $output, $returnValue);
        if ($returnValue == 0) {
            $pidFile = '/var/run/nginx/nginx.pid';
            if (file_exists($pidFile)) {
                $pid = trim(file_get_contents($pidFile));
                return posix_kill($pid, SIGHUP);
            }
        }
        return false;
    }

    public static function createHttpFile($args): bool {
        $domain = $args["domain"];
        $tld = $args["tld"];
    
        $template = <<<EOD
    server {
        listen 80;
        listen [::]:80;
        server_name $domain.$tld *.$domain.$tld;
        root /var/www/$domain$tld;
        index index.html;
    }
    EOD;
    
        $destination_name = "/etc/nginx/http.d/$domain.conf";
        $destination_file = fopen($destination_name, "w");
        if (flock($destination_file, LOCK_EX)) {
            fwrite($destination_file, $template);
            flock($destination_file, LOCK_UN);
        } else {
            throw new Exception("COULD_NOT_GET_FILE_ACCESS");
        }
        fclose($destination_file);
    
        mkdir("/var/www/$domain$tld", 0777, true);
        chown("/var/www/$domain$tld", "ftp");
        chgrp("/var/www/$domain$tld", "ftp");
    
        // ✨ Автоматически создаём простой index.html
        file_put_contents("/var/www/$domain$tld/index.html", "
    <!DOCTYPE html>
    <html lang=\"en\">
    <head>
        <meta charset=\"UTF-8\">
        <title>Welcome to $domain.$tld</title>
    </head>
    <body>
        <h1>Welcome to $domain.$tld!</h1>
        <p>Your hosting has been successfully created.</p>
    </body>
    </html>
    ");
    
        $ftppassword = self::generatepassword();
        FtpManager::addRecord($domain . $tld, $ftppassword);
    
        self::refreshServer();
    
        Hosting::where([
            ['domain', '=', $domain],
            ['tld', '=', $tld]
        ])->update([
            "status" => Status::Running->value,
            "ftp" => $ftppassword
        ]);
    
        return true;
    }
    

    public static function generatepassword(): string {
        $randomInt = random_int(0, pow(36, 5) - 1);
        $randomString = base_convert($randomInt, 10, 36);
        $randomString = str_pad($randomString, 5, '0', STR_PAD_LEFT);
        return substr($randomString, 0, 5);
    }
}
