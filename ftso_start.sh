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
echo $(date), "Starting Market Data Provider"
sleep 5s
node ./market_data_provider.js  >> $DIR/$FILE 2>&1 & echo FTSO started with PID $! 

while :
do
sleep 1m
if ps | grep "market_data_provider" | grep market_data_provider >/dev/null
then 
    echo $(date), "Market Data Provider is Healthy" >> $DIR/$FILE
else
    echo $(date), "Market Data Provider is dead - Restarting" >> $DIR/$FILE
    node ./market_data_provider.js  >> $DIR/$FILE 2>&1 & echo FTSO started with PID $! 
fi


done