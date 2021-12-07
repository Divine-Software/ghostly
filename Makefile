NODE_MODULES	= node_modules/.modules.yaml \
		  ghostly-cli/node_modules \
		  ghostly-engine/node_modules

DOCKER_VERSION	:= $(shell node -p 'require(`./ghostly-cli/package.json`).version')
DOCKER_ARCH	:= --platform linux/amd64,linux/arm64
DOCKER_ARGS	:= --build-arg version=$(DOCKER_VERSION)
DOCKER_REPO	:= divinesoftware/ghostly
DOCKER_TAGS	:= -t $(DOCKER_REPO):$(DOCKER_VERSION) -t $(DOCKER_REPO):latest

all:		build

prepare:	$(NODE_MODULES)

$(NODE_MODULES):package.json */package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc
	pnpm install --frozen-lockfile
	touch $(NODE_MODULES)

build::		prepare
	pnpx tsc --build
	ln -f README.md ghostly-engine/README.md
	ln -f README.md ghostly-cli/README.md
	ln -f README.md ghostly-runtime/README.md

build-docker:
	docker buildx build . $(DOCKER_ARGS) --load --tag $(DOCKER_REPO):dev

publish-docker:
	docker buildx --builder docker-container build . $(DOCKER_ARCH) $(DOCKER_ARGS) $(DOCKER_TAGS) --push

lint:
	-pnpm exec eslint '*/src/**/*.ts'

test::		lint

clean::
	rm -rf coverage
	make -C examples $@
	make -C website $@

distclean::
	rm -rf node_modules
	make -C examples $@
	make -C website $@

build test clean distclean publish::
	$(MAKE) -C ghostly-cli $@
	$(MAKE) -C ghostly-engine $@
	$(MAKE) -C ghostly-runtime $@

.PHONY:		all prepare build docker test clean distclean publish
