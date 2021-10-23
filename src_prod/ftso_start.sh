#!/bin/bash
DIR="/var/log"
FILE="run.log"
if [ ! -d "$DIR" ]; then
    mkdir $DIR
    touch $DIR/$FILE
else
    if [ ! -d "$DIR/$FILE" ]; then
    touch $DIR/$FILE
    else
    chmod +777 $DIR/$FILE
    fi
fi
echo $(date), "Starting FTSO"
node ./prod-price-provider.js  >> $DIR/$FILE 2>&1 & echo FTSO started with PID $! 

while :
do
sleep 1m
if ps | grep "prod-price-provider" | grep prod-price-provider >/dev/null
then 
    echo $(date), "FTSO is Healthy" >> $DIR/$FILE
else
    echo $(date), "FTSO is dead - Restarting" >> $DIR/$FILE
    node ./prod-price-provider.js  >> $DIR/$FILE 2>&1 & echo FTSO started with PID $! 
fi


done