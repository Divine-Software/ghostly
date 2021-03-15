all:		build

prepare:
	$(MAKE) -C ../ghostly-cli build
	yarn --frozen-lockfile --mutex network

build:		prepare
	yarn run build

watch:		prepare
	yarn run start

test:

clean:
	yarn run clear

distclean:	clean
	rm -rf node_modules

publish:	prepare clean
	@[[ -z "$$(git status --porcelain)" ]] || (git status; false)
	GIT_USER=LeviticusMB USE_SSH=true yarn run deploy

.PHONY:		all prepare build docs test clean distclean publish
