#!/bin/bash
# This script builds the backend inside a temporary Docker container.

ROOT_DIR="$(dirname $0)/.."
NPM_REGISTRY=https://registry.npmjs.org
NPM_REGISTRY=https://registry.npmmirror.com # remove this if no need for npm mirror

set -eo pipefail

enter_and_build() {
  DIR=$1
  SOURCE_FILES=$2

  cd $ROOT_DIR/$DIR
  echo "Entering $(pwd) and build things"

  rm -rf lib .tsbuildinfo || true
  mkdir lib

  # This command runs a Docker container with the node:18 image
  # mounts the current directory as a volume, and sets the working directory to /app.
  #
  # It then
  # - copies the source files to /app, 
  # - sets the npm registry to the specified value,
  # - installs the dependencies,
  # - builds the project.

  docker run -it --rm \
    -w /app \
    -v "$(pwd):/vol" \
    -v "$(pwd)/lib:/app/lib" \
    node:18 \
    bash -c "(cd /vol && cp -r $SOURCE_FILES /app) && npm config set registry \"$NPM_REGISTRY\" && npm install && npm run build"
}


enter_and_build backend 'src tsconfig.json package.json'
