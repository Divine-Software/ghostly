all:		build

prepare:	node_modules/.yarn-integrity

node_modules/.yarn-integrity:	package.json yarn.lock
	yarn --frozen-lockfile --mutex network
	touch $@

build::		prepare
	yarn run tsc --build

docs::		build

test::		build
	yarn run jest

clean::
	rm -rf coverage

distclean::
	rm -rf node_modules

build docs clean distclean::
	$(MAKE) -C ghostly-cli $@
	$(MAKE) -C ghostly-core $@
	$(MAKE) -C ghostly-template $@

.PHONY:		all prepare build docs test clean distclean
