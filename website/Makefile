NAME		:= $(shell node -p 'require(`./package.json`).name')
VERSION		:= $(shell node -p 'require(`./package.json`).version')
BASENAME	:= $(notdir $(NAME))

all:		build

prepare:
	$(MAKE) -C ../ghostly-cli build
	yarn --frozen-lockfile --mutex network

build:		prepare
	make -C ../examples $@
	yarn run build

watch:		prepare
	yarn run start

test:		build
	make -C ../examples $@

clean:
	make -C ../examples $@
	yarn run clear

distclean:	clean
	make -C ../examples $@
	rm -rf node_modules

publish:	distclean build test
	@[[ -z "$$(git status --porcelain)" ]] || (git status; false)
	git tag -s $(BASENAME)-v$(VERSION) -m "$(NAME) v$(VERSION)"
	yarn run deploy

.PHONY:		all prepare build docs test clean distclean publish
