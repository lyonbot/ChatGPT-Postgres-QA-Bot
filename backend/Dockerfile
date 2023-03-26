FROM node:18

ARG NPM_REGISTRY=https://registry.npmjs.org
RUN npm config set registry "${NPM_REGISTRY}"

WORKDIR /app
ADD package.json /app
RUN npm install --omit=dev

# == WARNING ==
# we do not build thing in this image.
# you shall run `npm run build` in the root directory
# after generating `lib`, build image again

ADD . /app/
RUN [ -f /app/lib/index.js ] || (echo "Error: backend not built. See README"; exit 1)

EXPOSE 8080
ENTRYPOINT [ "node", "." ]
