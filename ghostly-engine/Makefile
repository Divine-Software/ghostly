NAME		:= $(shell node -p 'require(`./package.json`).name')
VERSION		:= $(shell node -p 'require(`./package.json`).version')
BASENAME	:= $(notdir $(NAME))

all:		build

prepare:
	$(MAKE) -C .. $@

build:		prepare
	pnpx tsc --build

test:		build
	pnpx jest

clean:
	rm -rf build coverage

distclean:	clean
	rm -rf node_modules

publish:	clean build test
	@[[ -z "$$(git status --porcelain)" ]] || (git status; false)
	@[[ "`npm --version`" > "7" ]] || (echo Need npm v7+; false)
	git tag -s $(BASENAME)-v$(VERSION) -m "$(NAME) v$(VERSION)"
	pnpm publish --access public

.PHONY:		all prepare build docs test clean distclean publish
