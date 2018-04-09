#!/bin/bash -ex

cd $(dirname $0) && cd .. #Go root directory of this project

. "./scripts/build-env.sh"

function build_production() {
    npm run build
}

function docker_build() {
    docker build -t $DOCKER_IMAGE_NAME .
}

function docker_push() {
    # Tag & push the image into docker registry
    docker tag "${DOCKER_IMAGE_NAME}" "${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
    docker tag "${DOCKER_IMAGE_NAME}" "${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:latest"
    docker push "${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
    docker push "${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:latest"
}

function docker_run(){
    docker run --name cc-mock -d -p 23443:8080 "${DOCKER_IMAGE_NAME}"
}

eval "${1//-/_}"