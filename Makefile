SHELL=/bin/bash

# Below two lines allows us to accept extra arguments (by doing nothing when we get a job that doesn't match, rather than throwing an error)
%:
	@:

args = `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`

.PHONY:
.DEFAULT_GOAL: guide
push-env:
	@sh exportEnvJSON.sh
clean-install:
	@rm -r -f node_modules && rm -f package-lock.json && npm cache clean --force && npm install