all:		build

prepare:
	make -C ../ghostly-runtime $@
	pnpm install --frozen-lockfile

build:		prepare
	make -C ../ghostly-runtime $@
	pnpm run --dir ghostly-angular-template -- build --prod

test:		prepare
#	pnpm run --dir ghostly-angular-template -- ng test

clean:
	rm -rf ghostly-angular-template/dist

install:	build
	rsync -a --delete \
		ghostly-angular-template/dist/ghostly-angular-template/ \
		../website/static/examples/ghostly-angular-template/

uninstall:
	rm -rf ../website/static/examples/ghostly-angular-template

distclean:	clean
	rm -rf node_modules
	rm -rf ghostly-angular-template/node_modules

.PHONY:		all prepare build test clean distclean
