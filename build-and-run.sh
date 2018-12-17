#!/bin/bash

PORT=${1:-8080}
IP=${2:-localhost}
export VONQBEPORT

printf "REACT_APP_PORT=$PORT\nREACT_APP_IP=$IP\n"
printf "REACT_APP_PORT=$PORT\nREACT_APP_IP=$IP" > src/main/webapp/.env

cd src/main/webapp
npm install
npm run build

cd ../../../
./run-server.sh $PORT
