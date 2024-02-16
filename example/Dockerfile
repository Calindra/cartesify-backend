# syntax=docker.io/docker/dockerfile:1

# FROM rust:1.74.1-bookworm as middleware

# # https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/reference.md#example-cache-apt-packages
# RUN <<EOF
# rm -f /etc/apt/apt.conf.d/docker-clean
# echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
# EOF

# RUN \
#   --mount=type=cache,target=/var/cache/apt,sharing=locked \
#   --mount=type=cache,target=/var/lib/apt,sharing=locked \
#   apt-get update && \
#   apt-get install -y --no-install-recommends \
#   # build-essential=12.9 \
#   # ca-certificates=20230311 \
#   g++-riscv64-linux-gnu=4:12.2.0-5

# RUN rustup target add riscv64gc-unknown-linux-gnu

# WORKDIR /usr/src/http-api

# COPY http-api .

# RUN \
#   --mount=type=cache,target=/usr/local/cargo/registry/,sharing=locked \
#   cargo build --release --target=riscv64gc-unknown-linux-gnu

# build stage: includes resources necessary for installing dependencies

# Here the image's platform does not necessarily have to be riscv64.
# If any needed dependencies rely on native binaries, you must use 
# a riscv64 image such as cartesi/node:20-jammy for the build stage,
# to ensure that the appropriate binaries will be generated.
FROM node:20.8.0-bookworm as build-stage

WORKDIR /opt/cartesi/dapp
COPY . .
RUN npm i

# runtime stage: produces final image that will be executed

# Here the image's platform MUST be linux/riscv64.
# Give preference to small base images, which lead to better start-up
# performance when loading the Cartesi Machine.
FROM --platform=linux/riscv64 cartesi/node:20.8.0-jammy-slim

LABEL io.sunodo.sdk_version=0.2.0
LABEL io.cartesi.rollups.ram_size=300Mi

ARG MACHINE_EMULATOR_TOOLS_VERSION=0.12.0
RUN <<EOF
set -e
apt-get update
apt-get install -y --no-install-recommends busybox-static=1:1.30.1-7ubuntu3 ca-certificates=20230311ubuntu0.22.04.1 curl=7.81.0-1ubuntu1.15
curl -fsSL https://github.com/cartesi/machine-emulator-tools/releases/download/v${MACHINE_EMULATOR_TOOLS_VERSION}/machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.tar.gz \
  | tar -C / --overwrite -xvzf -
rm -rf /var/lib/apt/lists/*
EOF

ENV PATH="/opt/cartesi/bin:${PATH}"

WORKDIR /opt/cartesi/dapp
COPY --from=build-stage /opt/cartesi/dapp .

ENV ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004"

ENTRYPOINT ["rollup-init"]
RUN npm i -g nodemon && npm i express
COPY --from=build-stage /opt/cartesi/dapp/app.js .
# COPY --from=middleware /usr/src/http-api/target/riscv64gc-unknown-linux-gnu/release/http-api .

CMD ["node app.js"]
