# ChatGPT-Postgres-QA-Bot

This is a question-answering bot developed using Node.js. The technologies used are:

- 💾 Storage: Postgres + pgvector + Sequelize (ORM)
- 🔍 Indexing: OpenAI's Embedding model
- 🤖 Question-answering: OpenAI's GPT-3.5 model

## Quick Start

First, you need to install [docker-compose] on your computer.

Then create an `openai.env` file in the `env` folder (you can refer to the `openai.env.example` file).

### Run in Production Mode

```sh
pnpm run build                          # (need nodejs) build on host
# bash ./scripts/build-in-docker.sh     # or build in docker

bash ./scripts/prod-gen.sh              # generate ./docker-compose.prod.yml
docker compose -f docker-compose.prod.yml up --build # add `-d` to run in background
```

### Environment

Since the network situation is kinda limited, I added these special changes. If you don't need them, please remove:

- `TZ` in ./env/openai.env -- timezone
- `HTTP_PROXY` in ./env/openai.env -- http proxy to bypass firewall
- `NPM_REGISTRY` in many files -- npm mirror. you can safely remove those lines

## Develop and Debug

Directly run the docker-compose and your program will run in development mode.

```sh
pnpm run build                          # (need nodejs) build on host
# bash ./scripts/build-in-docker.sh     # or build in docker

docker compose up --build -d                   # Run all container in background
```

### Debugger

It will enable Inspector Port `9229`. You can attach to the container process in VSCode easily.

### Edit Code then Re-run

In Development Mode, docker-compose will mount host's `./backend/lib` directory into the `app` Docker container's `/app/lib`.

Therefore, you can run the newest code, without rebuilding images (unless you installed new npm packages).

Please run these commands at the same time, in different terminal panes:

```sh
# [1]
# observe outputs
bash ./scripts/dev-observe-logs.sh

# [2]
# build when sources change
# you will need nodejs >= 16, pnpm
pnpm run dev

# [3]
# restart app. run this when needed
docker compose restart -t 1 app
# docker compose up -d --build app      # if package.json changes
```

## 
