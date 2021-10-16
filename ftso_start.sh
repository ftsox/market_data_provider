#!/bin/bash
DIR="./logs"
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
yarn hardhat run ./deployment/scripts/prod-price-provider.ts --network songbird >> $DIR/$FILE 2>&1 & echo FTSO started with PID $! 

while :
do
sleep 1m
if ps -aux | grep "require ts-node/register" | grep prod-price-provider >/dev/null
then 
    echo $(date), "FTSO is Healthy" >> $DIR/$FILE
else
    echo $(date), "FTSO is dead - Restarting" >> $DIR/$FILE
    yarn hardhat run ./deployment/scripts/prod-price-provider.ts --network songbird >> $DIR/$FILE 2>&1 & echo FTSO started with PID $! 
fi


done