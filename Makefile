NODE_MODULES	= node_modules/.yarn-integrity \
		  ghostly-cli/node_modules \
		  ghostly-engine/node_modules

all:		build

prepare:	$(NODE_MODULES)

$(NODE_MODULES):package.json */package.json yarn.lock
	yarn --frozen-lockfile --mutex network
	touch $@

build::		prepare
	yarn run tsc --build
	ln -f README.md ghostly-engine/README.md
	ln -f README.md ghostly-cli/README.md
	ln -f README.md ghostly-runtime/README.md

test::		build
	yarn run jest

clean::
	rm -rf coverage

distclean::
	rm -rf node_modules

build clean distclean publish::
	$(MAKE) -C ghostly-cli $@
	$(MAKE) -C ghostly-engine $@
	$(MAKE) -C ghostly-runtime $@

.PHONY:		all prepare build test clean distclean publish
