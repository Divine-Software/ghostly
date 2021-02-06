all:		build

prepare:
	yarn

build::		prepare
	yarn run tsc --build

docs::		build

test::		build
	yarn run jest

clean::
	rm -rf coverage

distclean::
	rm -rf node_modules

docs clean distclean::
	$(MAKE) -C ghostly-cli $@
	$(MAKE) -C ghostly-core $@

.PHONY:		all prepare build docs test clean distclean
