#!/bin/sh

# создаем базу данных, если не существует
mysql -u root -prootpass -e "CREATE DATABASE IF NOT EXISTS upcehosting;"
mysql -u root -prootpass -e "GRANT ALL PRIVILEGES ON upcehosting.* TO 'user'@'%' IDENTIFIED BY 'password';"

# запуск php-скрипта
php /opt/app/worker/DnsUtil.php

# запуск миграций
cd /opt/app
./vendor/bin/phinx migrate
