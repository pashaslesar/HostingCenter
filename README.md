# BSPWE

## **Spuštění platformy**: 
Platforma běží v jednom kontejneru a může pustit například přes docker-compose příkazem:<br>
`docker-compose build` a následně `docker-compose up -d`.<br>
Následně je potřeba nastavit IP addresu DNS serveru na svém stroji, na adresu kontejneru.

Pro linux existuje skript update-ns.sh, který přepíná mezi přidáním nameserveru a odebráním


## **Úvod a architektura**
Tento dokument slouží jako technická příručka pro webhostingovou platformu.
Webhostingová platforma běží na kontejneru využívajícím Alpine Linux jako operační systém. 
Samotná platforma je složena s několika služeb, které vzájemně komunikují. 
v následujících částech budou popsány podrobněji.

### <ins>dnsmasq</ins>
Dnsmasq je lehký server DNS a DHCP, který je využíván v platformě k překladu názvu hostitele a jeho odpovídající IP adresy v místní síti. <br> Jednotlivé záznamy hostitelu/IP jsou uloženy v "hostfile"<br>
Na platformě jsou nakonfigurované jsou 2 hostifile: 
- *priority* - pro záznamy Aplikačního serveru a GUI panelu.
- *users* - pro záznamy uživatelů - spravovány HostingWorker službou.

Před spuštením kontejneru není předem určena IP adresa kontejneru, z tohoto důvodu nejsou záznamy hostitele uloženy přímo v souborech hostitele, ale místo toho jsou uloženy v samostatném souboru s koncovkou .dat, který se při spuštění načte do souboru hostitele se správnou IP adresou pomocí DnsUtil skriptu. (/opt/app/worker/DnsUtil.php)

### <ins>nginx</ins>
Webový server používaný ke správě virtuálních hostitelů pro platformu.
Defaultně nakonfigurované virtuální hostitle jsou pouze pro GUI a aplikační server.
Ve složce /etc/nginx/http.d se ukládají virtuální hosti. Ti jsou spravováni službou HostingWorker.<br>
Virtuální host se vytváři ze šablony a obecně pro něj plati, že má kořen ve /var/www/{domena}. Tato složka je pro něj vytvořena

### <ins>vsftpd</ins>
Vsftpd je lehký, bezpečný a rychlý FTP server, který je pro platformu je nakonfigurovaný s podporou virtuálních uzivatelu přes pam.d pwdfile. FTP uživatele spravuje HostingWorker služba. "virtuální uživatel" Odpovídá doméně a existuje pouze jeden účet na doménu. "Virtuální uživatel" má přístup pouze ke své složce v adresaci /var/www/{domena}

### <ins>postgresql</ins>
Postgresql je systém správy relačních databází. Na platformě defaultně existují databaze pro aplikacni server, které ukládají stav a nastavení všech služeb pro daného virtuálního hostitele a uživatele, který virtualního hostitele objednal. Postgres také používáme pro databáze uživatelů. Služba HostingWorker je zodpovědná za vytvoření uživatele a databáze a konfiguraci přístupu pro něj.

### <ins>Aplikační Server</ins> 
PHP aplikace, která primárně přijmá požadavky na správu hostingu pro uživatele. Server je napojený na HostingWorker, 
přes Redis frontu, které posílá zprávy s definicí operace a parametrami operace. 

### <ins>GUI panel</ins>
Rozhraní pro uživatele. Jednoduchá React SPA, která komunikuje s aplikačním serverem. 

### <ins>HostingWorker</ins>
Hlavní komponenta platformy. Dlouhodobě běžící PHP skript ke správě služeb. Provadí CRUD operace v jednotlivých službách a zároveň je schopný po provedení operace, aktualizovat konfiguraci dané služby za běhu. Je napojený na aplikační server přes redis frontu, přes kterou přijmá požadavky s parametry na provední operace. 

## **Workflow platformy**: 

### <ins>Start platformy</ins>
O spouštění služeb na kontejneru se stará open-rc.<br>
Pro službu HostingWorker existuje vlastní openrc skript, který se stará o 2 věci: 
1. Při spuštění provede migrace databázi pro Aplikační server stránky, přegeneruje hostfiles pro Dnsmasq s IP addressou kontejneru.
2. Spuštění/zastavení/restart služby HostingWorker

Zbytek se služeb se spustí a platfroma je připravena k použití.

### <ins>Uživatelská akce</ins>
Příklad: vytvoření hostingu:
Pokud se uživatel přihlásí a vyvolá požadavek na zřízení webhostingu (např. s domenou "domena.cz") tak přijde požadavek aplikačnímu server.
Aplikační server nasledně v databázi vytvoří zaznam o zřízení virtualu, databaze a domeny. Všem znaznamům nastaví stav CREATING.
Poté pro každý vyvořený zanam vytvoří zprávu pro Redis frontu, ve které jsou udaje zadané uživatelem a oprace, která se musí provést.
Tím požadavek v aplikačním serveru končí a uživatel nyní může hosting vidět v gui panelu.
Zprávy redis fronty konzumuje HostingWorker, který následně požadavek vykoná:
* Pro virtual vytvoří podle šablony nový soubor ve složce /etc/nginx/http.d se jménem domena.cz.<br>
Dale vytvoří složku v adresáři /var/www/domenacz a vytvoří ve vsftpd službě virtualního uživatele, který bude mít práva na tuto složku<br>
Nakonec vynutí update konfiguraci nginx wokeru a nastavi v databazi ftp heslo a stav virtualu na CREATED.
* Pro doménu vytvoří záznam v .dat souboru pro uživatele /etc/dnsmasq.d/users.hosts.dat a překlopí tento soubor
do /etc/dnsmasq.d/users.hosts. Na dnsmsaq serveru nakonec vynutí aktualizaci konfigurace a nastaví v databázi stav CREATED doméně.
* Pro databazi vytvoří v postgresql uživatele a databazi domenacz vytvoří heslo přidá práva vytvořenému uživateli
na vyvořenou databazi a nakonec nastaví v hostingové databazi heslo db a stav na CREATED 

