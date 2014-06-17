REPORTER = spec
TESTFILES = $(shell find test/ -name '*.test.js')

install:
	@echo "Installing production"
	@npm install --production
	@echo "Install complete"

build: lint test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(TESTFILES)

lint:
	@echo "Linting..."
	@./node_modules/jshint/bin/jshint \
		--config .jshintrc \
		lib/**/*.js test/*.js

coverage:
	@echo "Generating coverage report.."
	@istanbul cover _mocha
	@echo "Done: ./coverage/lcov-report/index.html"

.PHONY: install build test lint coverage
