<?php
require_once __DIR__ . '/DnsManager.php';

Worker\DnsManager::processFiles();
Worker\DnsManager::refreshServer();

echo "Records routed to " . getHostByName(getHostName()) . "\n"; 