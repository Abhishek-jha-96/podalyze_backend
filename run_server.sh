#!/bin/bash


if [ $# -ge 1 ]; then
  env=$1
  podman compose -f docker-compose.$env.yaml down
  podman compose -f docker-compose.$env.yaml up -d
else
  podman compose --env-file .env down
  podman compose --env-file .env up -d
fi