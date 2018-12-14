#!/bin/bash

VONQBEPORT=${1:-8080}
export VONQBEPORT

echo "REACT_APP_VONQBEPORT=$VONQBEPORT"
echo "REACT_APP_VONQBEPORT=$VONQBEPORT" > src/main/webapp/.env

cd src/main/webapp
npm install
npm run build

cd ../../../
./run-server.sh $VONQBEPORT

