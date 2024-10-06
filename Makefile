requests::
	curl http://localhost:3001/data?name=John&age=30
	curl -X PUT http://localhost:3001/data/123 -H "Content-Type: application/json" -d '{"status":"updated"}'
	curl -X DELETE http://localhost:3001/data/123
	curl -X POST http://localhost:3001/data -H "Content-Type: application/json" -d '{"name":"John", "age":30}'
