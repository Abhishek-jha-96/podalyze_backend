#!/bin/bash


if [ $# -ge 1 ]; then
  env=$1
  docker-compose -f docker-compose.$env.yaml down
  docker-compose -f docker-compose.$env.yaml up -d
else
  docker-compose down
  docker-compose up -d
fi