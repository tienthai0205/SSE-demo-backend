# SSE-demo-backend

This is a simple Node.js backend project to test the SSE (Server-sent events) connection netween the server and the [angular](https://github.com/tienthai0205/SSE-demo-frontend) app

To run the server (with nodemon)

```
  npm run serve
```
Server will be running at port 3000

To test add new event (POST), simply run the following command:

```
 curl -X POST \
 -H "Content-Type: application/json" \
 -d '{"id": 1, "info": "Shark embedded in the gums rather than directly affixed to the jaw, and are constantly replaced throughout life.", "source": "https://en.wikipedia.org/wiki/Shark"}'\
 -s http://localhost:3000/facts
```

Endpoints:

- GET event: `/events`
- POST fact: `/facts`

Author: Tien Thai
