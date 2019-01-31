#!/bin/bash

PORT=${1:-8080}
IP=${2:-localhost}

printf "REACT_APP_PORT=$PORT\nREACT_APP_IP=$IP\n"
printf "REACT_APP_PORT=$PORT\nREACT_APP_IP=$IP" > webapp/.env

cd webapp
npm install
npm run build

cd ../

mvn package
