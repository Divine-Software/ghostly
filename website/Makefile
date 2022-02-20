all:		build

prepare:
	$(MAKE) -C ../ghostly-cli build
	pnpm install --frozen-lockfile

build:		prepare
	pnpm run build

watch:		prepare
	pnpm run start

test:

clean:
	-pnpm run clear
	rm -rf build docs/api

distclean:	clean
	rm -rf node_modules

publish:	prepare clean
	@[[ -z "$$(git status --porcelain)" ]] || (git status; false)
	GIT_USER=LeviticusMB USE_SSH=true pnpm run deploy

.PHONY:		all prepare build docs test clean distclean publish
