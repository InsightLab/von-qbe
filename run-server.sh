#!/bin/bash

VONQBEPORT=${1:-8080}
echo "Spring port: $VONQBEPORT"
export VONQBEPORT

mvn spring-boot:run
