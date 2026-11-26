# Product API

The API stores products in memory, so product data is cleared when the server
restarts. Every endpoint requires the `x-api-key` request header. The server
checks that the header is present but does not validate its value.

## Products

### `GET /api/products`

Returns all products with `200 OK`. An optional `category` query parameter
filters the results by exact category match.

### `GET /api/products/:id`

Returns the product with the specified numeric ID and `200 OK`.

If no product has that ID, the response is `404 Not Found`:

```json
{"error":"Product not found"}
```

### `POST /api/products`

Create a product by sending a JSON object with these fields:

| Field | Type | Requirement |
| --- | --- | --- |
| `name` | string | Required; must not be empty. |
| `price` | number | Required; must be greater than zero. |
| `stock` | integer | Required; must be zero or greater. |
| `category` | string | Optional. |

Returns `201 Created` with the product and its generated numeric `id`.

Invalid or missing fields return `400 Bad Request`:

```json
{
  "error": "Validation failed",
  "details": [
    {"path":"stock","message":"Invalid input: expected number, received undefined"}
  ]
}
```

## Errors

All endpoints return `401 Unauthorized` if the `x-api-key` header is missing:

```json
{"error":"Missing x-api-key header"}
```

`POST /api/products` returns `400 Bad Request` when the request body does not
match the field requirements above. `GET /api/products/:id` returns
`404 Not Found` when the product does not exist.
