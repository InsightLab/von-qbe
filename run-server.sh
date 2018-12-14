#!/bin/bash

VONQBEPORT=${1:-8080}
export VONQBEPORT

mvn spring-boot:run
