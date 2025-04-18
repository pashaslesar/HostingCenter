#!/bin/bash
FIRSTCHAR=`head -c 1 /etc/resolv.conf`
if [ "$FIRSTCHAR" = "#" ]
then
    CNTID=`docker ps -aqf "name=bspwe_hosting"`
    IPP=`docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $CNTID`
    echo -e "nameserver $IPP\n$(cat /etc/resolv.conf)" > /etc/resolv.conf
    echo "NO ENTRY FOUND, ADDED - $IPP"
else
    echo "THERE WAS ENTRY, DELETED."
    sed '1d' /etc/resolv.conf > tmpfile; mv tmpfile /etc/resolv.conf # POSIX
fi


# Toggles an entry in "/etc/resolv.conf" setting the nameserver 
# to the ip of the container in this directory
