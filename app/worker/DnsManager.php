<?php
namespace Worker;

use App\Hosting\Status;
use App\Models\Domain;
use Exception;

class DnsManager {

    const USERS_HOST = "/etc/dnsmasq.d/users.hosts.dat";
    const DEFAULT_HOSTS = [
        "/etc/dnsmasq.d/users.hosts.dat" => "/etc/dnsmasq.d/users.hosts",
        "/etc/dnsmasq.d/priority.hosts.dat" => "/etc/dnsmasq.d/priority.hosts",
    ];

    public static function processFiles() {
        foreach (self::DEFAULT_HOSTS as $unprocessed => $destination) {
            self::processFile($unprocessed, $destination);
        }
    }

    public static function refreshServer(): bool {
        $returnValue = null;
        $output = array();
        exec("dnsmasq --test", $output, $returnValue);
        if ($returnValue == 0) {
            $pidFile = '/var/run/dnsmasq.pid';
            if (file_exists($pidFile)) {
                $pid = trim(file_get_contents($pidFile));
                return posix_kill($pid, SIGHUP);
            }
        }
        return false;
    }

    public static function addHostsfileRecord($args): void {
        $handle = fopen(self::USERS_HOST, "a");
        if (flock($handle, LOCK_EX)) {
            fwrite($handle, $args['hosts_record'] . "\n");
            flock($handle, LOCK_UN);
        } else {
            throw new Exception("COULD_NOT_GET_FILE_ACCESS");
        }
        fclose($handle);

        $domainParts = explode('.', $args['domain']);
        $domain = $domainParts[0];
        $tld = $domainParts[1] ?? '';

        Domain::where("domain", $domain)
            ->where("tld", $tld)
            ->update(["status" => Status::Running->value]);

        self::processFiles();
        self::refreshServer();
    }

    private static function processFile($unprocessed, $destination) {
        $local_ip = getHostByName(getHostName());
        $input = fopen($unprocessed, "r");
        $output = fopen($destination, "w");

        if (flock($input, LOCK_EX) && flock($output, LOCK_EX)) {
            while (!feof($input)) {
                $line = fgets($input);
                fwrite($output, str_replace("XXX", $local_ip, $line));
            }
            flock($input, LOCK_UN);
            flock($output, LOCK_UN);
        } else {
            throw new Exception("COULD_NOT_GET_FILE_ACCESS");
        }
        fclose($input);
        fclose($output);
    }
}
