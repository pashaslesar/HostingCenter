#!/bin/sh

set -e

USERNAME=$1
PASSWORD=$2

VIRTUAL_USERS="/etc/vsftpd/virtual_users"
USER_CONF_DIR="/etc/vsftpd/vusers"
WWW_DIR="/var/www"
FTP_PASS_LOG="/etc/vsftpd/ftp_passwords.log"
VSFTPD_CONF="/etc/vsftpd/vsftpd.conf"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ]; then
    echo "${RED}[ERROR] Usage: $0 username password${NC}"
    exit 1
fi

echo "${GREEN}[INFO] Creating FTP user: $USERNAME${NC}"

# Генерим хеш
HASH=$(openssl passwd -1 "$PASSWORD")

# Добавляем юзера
if grep -q "^$USERNAME:" "$VIRTUAL_USERS"; then
    echo "${YELLOW}[WARN] User already exists, updating password...${NC}"
    sed -i "s/^$USERNAME:.*/$USERNAME:$HASH/" "$VIRTUAL_USERS"
else
    echo "${GREEN}[INFO] Adding new user${NC}"
    echo "$USERNAME:$HASH" >> "$VIRTUAL_USERS"
fi

# Сохраняем оригинальный пароль
echo "$USERNAME:$PASSWORD" >> "$FTP_PASS_LOG"
chmod 600 "$FTP_PASS_LOG"

# Конфиг для пользователя
mkdir -p "$USER_CONF_DIR"
cat <<EOF > "$USER_CONF_DIR/$USERNAME"
local_root=$WWW_DIR/$USERNAME
write_enable=YES
EOF

# Создаем директорию
mkdir -p "$WWW_DIR/$USERNAME"
chown -R ftp:ftp "$WWW_DIR/$USERNAME"

# Рестартуем
echo "${GREEN}[INFO] Restarting vsftpd using config: $VSFTPD_CONF${NC}"
pkill vsftpd || true
vsftpd "$VSFTPD_CONF" &

echo "${GREEN}[SUCCESS] FTP user '$USERNAME' created and ready to use.${NC}"
