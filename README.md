# E-commerce Product API

A small in-memory product API. Products are lost when the server restarts.

## Quickstart

Requires Node.js 20 or later.

```sh
npm install
npm run build
npm start
```

The server listens on `http://localhost:3000` by default. Set `PORT` to use a
different port. Every endpoint requires the `x-api-key` request header; this
starter API checks that the header is present but does not validate its value.

### Happy path: create and get a product

Create a product (the `category` field is optional):

```sh
curl -i -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key" \
  -d '{"name":"Coffee","price":12.5,"stock":20,"category":"drinks"}'
```

The server responds with `201 Created` and the product, including its generated
`id`:

```json
{"id":1,"name":"Coffee","price":12.5,"stock":20,"category":"drinks"}
```

Fetch that product by its returned ID:

```sh
curl -i http://localhost:3000/api/products/1 \
  -H "x-api-key: demo-key"
```

This responds with `200 OK` and the same product. To list products, use
`GET /api/products`; filter by category with
`GET /api/products?category=drinks`.

### Sad path: validation error and missing product

Omitting the required `stock` field returns `400 Bad Request`:

```sh
curl -i -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key" \
  -d '{"name":"Coffee","price":12.5}'
```

The response has an `error` and a `details` array describing invalid fields:

```json
{"error":"Validation failed","details":[{"path":"stock","message":"Invalid input: expected number, received undefined"}]}
```

Requesting an ID that does not exist returns `404 Not Found`:

```sh
curl -i http://localhost:3000/api/products/999 \
  -H "x-api-key: demo-key"
```

```json
{"error":"Product not found"}
```

Requests without `x-api-key` return `401 Unauthorized` with
`{"error":"Missing x-api-key header"}`.

## Endpoints

| Method | Path | Success | Description |
| --- | --- | --- | --- |
| `GET` | `/api/products` | `200` | List products; optionally filter by `category`. |
| `POST` | `/api/products` | `201` | Create a product with `name`, `price`, and `stock`. |
| `GET` | `/api/products/{id}` | `200` | Get a product by ID. |

All endpoints require the `x-api-key` header. See [`openapi.yaml`](openapi.yaml)
for request and response schemas.
