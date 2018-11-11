all:		build

clean prepare build publish::
	make -C ghostly $@
	make -C ghostly-cli $@

clean::
	rm -rf node_modules

.PHONY:		all clean prepare build publish
