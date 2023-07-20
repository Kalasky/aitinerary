.PHONY: build down start

build:
	docker compose build

down:
	docker compose down

start:
	docker compose up

logs:
	docker compose logs -f

rebuild:
	make down
	make build
	make start