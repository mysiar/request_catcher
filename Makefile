install::
	rm -rf node_modules
	npm install

run::
	node app.js


requests::
	curl http://localhost:3001/default/data?name=John&age=30
	curl -X PUT http://localhost:3001/default/data/123 -H "Content-Type: application/json" -d '{"status":"updated"}'
	curl -X DELETE http://localhost:3001/default/data/123
	curl -X POST http://localhost:3001/default/data -H "Content-Type: application/json" -d '{"name":"John", "age":30}'

	curl http://localhost:3001/devtest/data?name=John&age=30
	curl -X PUT http://localhost:3001/devtest/data/123 -H "Content-Type: application/json" -d '{"status":"updated"}'
	curl -X DELETE http://localhost:3001/devtest/data/123
	curl -X POST http://localhost:3001/devtest/data -H "Content-Type: application/json" -d '{"name":"John", "age":30}'
