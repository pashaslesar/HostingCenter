<?php
namespace Worker;
use Exception;

class FtpManager {

    const VIRTUAL_USERS = "/etc/vsftpd/virtual_users";

    public static function addRecord($username, $password) {
        // some checks
        // echo "myuser:$(openssl passwd -1 newpass)" >> /etc/vsftpd/virtual_users
        // $salt = openssl_random_pseudo_bytes(6);
        // $hash = '$1$' . base64_encode($salt) . '$' . openssl_digest($salt . $password, 'md5');
        $returnValue = null;
        $hash = array();
        exec("openssl passwd -1 $password", $hash, $returnValue);
        $handle = fopen(self::VIRTUAL_USERS, "a");
        if (flock($handle, LOCK_EX)) {
            // probably should test config
            // also should probably backup before writing
            fwrite($handle, "$username:".$hash[0]."\n");
            flock($handle, LOCK_UN);
        } else {
            throw new Exception("COULD_NOT_GET_FILE_ACCESS");
            echo "could not get access";
        }
    }

    public static function findRecord($args) {
    }

    public static function removeRecord($args) {
    }
}