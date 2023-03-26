#!/bin/bash

ROOT_DIR="$(dirname $0)/.."
cd $ROOT_DIR

NOW=$(date -u +%FT%TZ)
while true; do 
  docker compose logs -f --since=$NOW app
  NOW=$(date -u +%FT%TZ)
  sleep 0.5
done
