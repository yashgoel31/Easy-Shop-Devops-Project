#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="easyshop"
TAG="${1:-latest}"
REGISTRY="${DOCKER_REGISTRY:-yashgoel31}"

FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${TAG}"

echo "Building Docker image: $FULL_IMAGE..."
docker build -f DockerFile -t "$FULL_IMAGE" .

echo "Docker build completed successfully."
if [ "${PUSH_IMAGE:-false}" = "true" ]; then
  echo "Pushing image to $REGISTRY..."
  docker push "$FULL_IMAGE"
fi
