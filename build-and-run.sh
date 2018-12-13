#!/bin/bash

cd src/main/webapp
npm install
npm run build

cd ../../../
./run-server.sh

