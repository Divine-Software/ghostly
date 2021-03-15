all:		build

prepare:
	make -C ../ghostly-runtime $@
	yarn --cwd ghostly-angular-template --frozen-lockfile --mutex network

build:		prepare
	make -C ../ghostly-runtime $@
	yarn --cwd ghostly-angular-template run build --prod

test:		prepare
#	yarn --cwd ghostly-angular-template run ng test

clean:
	rm -rf ../website/static/examples/ghostly-angular-template

dist:		build
	rsync -a --delete \
		ghostly-angular-template/dist/ghostly-angular-template/ \
		../website/static/examples/ghostly-angular-template/

distclean:	clean
	rm -rf ghostly-angular-template/node_modules

.PHONY:		all prepare build test clean distclean
