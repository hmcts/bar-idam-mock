# Get the root directory of this Makefile
ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

# Make build.sh executable
$(shell chmod +x $(ROOT_DIR)/scripts/build.sh)

build-production:
	$(ROOT_DIR)/scripts/build.sh build-production
docker-build:
	$(ROOT_DIR)/scripts/build.sh docker-build
docker-push:
	$(ROOT_DIR)/scripts/build.sh docker-push
docker-run:
	$(ROOT_DIR)/scripts/build.sh docker-run
run-dev:
	PORT=23443 npm run dev

