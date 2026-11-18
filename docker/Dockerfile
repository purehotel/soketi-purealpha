# Container image of soketi-purealpha (Soketi 1.6.1 + uWebSockets.js v20.71.0) on Node.js 24 LTS.
# Build from the repository root:  docker build --platform linux/amd64 -f docker/Dockerfile \
#   --build-arg SOKETI_REVISION=$(git rev-parse HEAD) -t soketi-purealpha .
# Debian trixie (glibc 2.41), not Alpine: uWebSockets.js ships no musl binaries,
# and the v20.71.0 linux binary requires glibc >= 2.38 (bookworm has 2.36).
# Base image pinned by digest (Node 24.22.3).
FROM public.ecr.aws/docker/library/node:24-trixie-slim@sha256:af02d57b57719b9657a45199a79264a9437940cd55b3c7b3fc99615654f124a0 AS build

ENV PYTHONUNBUFFERED=1

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates git python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

# package-lock references uWebSockets.js via git+ssh; containers have no SSH keys.
RUN git config --global url."https://github.com/".insteadOf "ssh://git@github.com/"

WORKDIR /tmp/build
COPY . .

RUN npm ci \
 && npm run build \
 && npm ci --omit=dev --ignore-scripts \
 && npm prune --omit=dev \
 && find node_modules/uWebSockets.js -maxdepth 1 -name 'uws_*.node' ! -name 'uws_linux_x64_137.node' -delete \
 && node -e "require('uWebSockets.js'); console.log('uWS loads on Node ' + process.version)" \
 && mkdir -p /app \
 && cp -r bin dist node_modules LICENSE package.json package-lock.json README.md /app/

FROM public.ecr.aws/docker/library/node:24-trixie-slim@sha256:af02d57b57719b9657a45199a79264a9437940cd55b3c7b3fc99615654f124a0

ARG SOKETI_REVISION=unknown
LABEL org.opencontainers.image.title="soketi-purealpha" \
      org.opencontainers.image.description="Soketi 1.6.1 + uWebSockets.js v20.71.0 on Node 24 (AGPL-3.0, source: image.source)" \
      org.opencontainers.image.licenses="AGPL-3.0" \
      org.opencontainers.image.source="https://github.com/purehotel/soketi-purealpha" \
      org.opencontainers.image.revision="${SOKETI_REVISION}"

COPY --from=build --chown=node:node /app /app

WORKDIR /app
USER node
EXPOSE 6001 9601

ENTRYPOINT ["node", "/app/bin/server.js", "start"]
