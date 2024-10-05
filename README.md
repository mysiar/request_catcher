# Simple request catcher



### Calls example

#### GET request with query params
curl "http://localhost:3001/data?name=John&age=30"

#### POST request with JSON body
curl -X POST http://localhost:3001/data -H "Content-Type: application/json" -d '{"name":"John", "age":30}'

#### PUT request with URL params
curl -X PUT http://localhost:3001/data/123 -H "Content-Type: application/json" -d '{"status":"updated"}'

#### DELETE request
curl -X DELETE http://localhost:3001/data/123`  
