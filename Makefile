.PHONY: console
console: bin
	php7.4 bin/console

.PHONY: update
update:
	php7.4 /usr/local/bin/composer update

.PHONY: require
require:
	php7.4 /usr/local/bin/composer require

.PHONY: prepare-dev
prepare-dev: bin
	php7.4 bin/console cache:clear --env=dev
	php7.4 bin/console doctrine:database:drop --if-exists -f --env=dev
	php7.4 bin/console doctrine:database:create --env=dev
	php7.4 bin/console doctrine:schema:update -f --env=dev
	php7.4 bin/console doctrine:fixtures:load -n --env=dev

.PHONY: jwt-generate
jwt-generate:
	php7.4 bin/console lexik:jwt:generate-keypair --overwrite
