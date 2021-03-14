NAME		:= $(shell node -p 'require(`./package.json`).name')
VERSION		:= $(shell node -p 'require(`./package.json`).version')
BASENAME	:= $(notdir $(NAME))

all:		build

prepare:
	$(MAKE) -C .. $@

build:		prepare
	yarn run tsc --build

test:		build
	yarn run jest --passWithNoTests

clean:
	rm -rf build coverage

distclean:	clean
	rm -rf node_modules

publish:	clean build test
	@[[ -z "$$(git status --porcelain)" ]] || (git status; false)
	git tag -s $(BASENAME)-v$(VERSION) -m "$(NAME) v$(VERSION)"
	yarn publish --non-interactive --access public

.PHONY:		all prepare build docs test clean distclean publish