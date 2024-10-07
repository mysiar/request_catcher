install::
	rm -rf node_modules
	npm install

run::
	node app.js

rund::
	docker run -d -p 3100:3100 $(shell docker build -q .)

requests::
	curl http://localhost:3100/default/data?name=John&age=30
	curl -X PUT http://localhost:3100/default/data/123 -H "Content-Type: application/json" -d '{"status":"updated"}'
	curl -X DELETE http://localhost:3100/default/data/123
	curl -X POST http://localhost:3100/default/data -H "Content-Type: application/json" -d '{"name":"John", "age":30}'

	curl http://localhost:3100/devtest/data?name=John&age=30
	curl -X PUT http://localhost:3100/devtest/data/123 -H "Content-Type: application/json" -d '{"status":"updated"}'
	curl -X DELETE http://localhost:3100/devtest/data/123
	curl -X POST http://localhost:3100/devtest/data -H "Content-Type: application/json" -d '{"name":"John", "age":30}'
