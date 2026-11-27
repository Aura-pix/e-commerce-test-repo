# Product API

The API stores products in memory, so product data is cleared whenever the
server restarts.

## Base URL

```text
http://localhost:3000
```

## Authentication

Every endpoint requires an `x-api-key` request header. The header is checked
for presence but its value is not validated.

```http
x-api-key: <any-value>
```

If the header is missing, the API returns `401 Unauthorized`:

```json
{
  "error": "Missing x-api-key header"
}
```

## Products

### `GET /api/products`

Returns all products.

**Query parameters**

| Parameter  | Type   | Required | Description                                  |
| ---------- | ------ | -------- | -------------------------------------------- |
| `category` | string | No       | Filters products by an exact category match. |

**Successful response**

`200 OK`

```json
[
  {
    "id": 1,
    "name": "Keyboard",
    "price": 79.99,
    "stock": 12,
    "category": "Accessories",
    "discountPercentage": 10,
    "imageUrls": ["https://example.com/keyboard.jpg"]
  }
]
```

### `GET /api/products/:id`

Returns the product with the specified numeric ID.

**Successful response**

`200 OK`

```json
{
  "id": 1,
  "name": "Keyboard",
  "price": 79.99,
  "stock": 12,
  "category": "Accessories"
}
```

**Error response**

`404 Not Found`

```json
{
  "error": "Product not found"
}
```

### `POST /api/products`

Creates a product. Send a JSON object with the following fields:

| Field                | Type     | Required | Constraints                        |
| -------------------- | -------- | -------- | ---------------------------------- |
| `name`               | string   | Yes      | Must not be empty.                 |
| `price`              | number   | Yes      | Must be greater than zero.         |
| `stock`              | integer  | Yes      | Must be zero or greater.           |
| `category`           | string   | No       | -                                  |
| `discountPercentage` | number   | No       | Must be from 0 through 100.        |
| `imageUrls`          | string[] | No       | Valid URLs, with a maximum of five. |

**Example request**

```json
{
  "name": "Keyboard",
  "price": 79.99,
  "stock": 12,
  "category": "Accessories",
  "discountPercentage": 10,
  "imageUrls": ["https://example.com/keyboard.jpg"]
}
```

**Successful response**

`201 Created`

```json
{
  "id": 1,
  "name": "Keyboard",
  "price": 79.99,
  "stock": 12,
  "category": "Accessories",
  "discountPercentage": 10,
  "imageUrls": ["https://example.com/keyboard.jpg"]
}
```

**Error response**

`400 Bad Request`

```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": "stock",
      "message": "Invalid input: expected number, received undefined"
    }
  ]
}
```

### `PATCH /api/products/:id`

Partially updates the product with the specified numeric ID. Only `price` is
currently supported.

| Field   | Type   | Required | Constraints                |
| ------- | ------ | -------- | -------------------------- |
| `price` | number | No       | Must be greater than zero. |

**Successful response**

`200 OK`

```json
{
  "id": 1,
  "name": "Keyboard",
  "price": 89.99,
  "stock": 12,
  "category": "Accessories"
}
```

**Error responses**

`404 Not Found`

```json
{
  "error": "Item not found, contact support"
}
```

`422 Unprocessable Entity`

```json
{
  "error": "Price must be greater than 0"
}
```

### `DELETE /api/products/:id`

Deletes the product with the specified numeric ID.

Products with stock greater than zero cannot be deleted.

**Successful response**

`204 No Content`

The response body is empty.

**Error responses**

`404 Not Found`

```json
{
  "error": "Product not found"
}
```

`409 Conflict`

```json
{
  "error": "Cannot delete product with existing stock"
}
```
