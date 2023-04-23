clean:
	docker rm $(shell docker ps -a -f status=exited -q)

test:
	docker-compose -f docker-compose.test.yaml run app-test

run:
	docker-compose up
