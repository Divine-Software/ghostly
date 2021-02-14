all:		build

prepare:
	yarn --cwd ghostly-angular-template --frozen-lockfile --mutex network

build:		prepare
	yarn --cwd ghostly-angular-template run build --prod

test:		prepare
#	yarn --cwd ghostly-angular-template run ng test

clean:
	rm -rf ../website/static/examples/ghostly-angular-template

distclean:	clean
	rm -rf ghostly-angular-template/node_modules

.PHONY:		all prepare build test clean distclean
