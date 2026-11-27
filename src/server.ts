import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  category: z.string().optional(),
  discountPercentage: z.number().min(0).max(100).optional(), // From our first test
  // NEW CONTEXT ADDITION
  imageUrls: z
    .array(z.string().url())
    .max(5)
    .optional()
    .describe("Up to 5 image URLs for the product"),
});

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category?: string;
  discountPercentage?: number; // From our first test
  imageUrls?: string[]; // NEW CONTEXT ADDITION
};

const products: Product[] = [];
let nextProductId = 1;

app.use((req, res, next) => {
  if (req.header("x-api-key") === undefined) {
    res.status(401).json({ error: "Missing x-api-key header" });
    return;
  }

  next();
});

app.get("/api/products", (req, res) => {
  const category = req.query.category;
  const filteredProducts =
    typeof category === "string"
      ? products.filter((product) => product.category === category)
      : products;

  res.json(filteredProducts);
});

app.post("/api/products", (req, res) => {
  const result = createProductSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Validation failed",
      details: result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  const product: Product = { id: nextProductId++, ...result.data };
  products.push(product);
  res.status(201).json(product);
});

// TODO: Add pagination support
app.get("/api/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(product);
});

app.delete("/api/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const index = products.findIndex((item) => item.id === productId);

  if (index === -1) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  if (products[index].stock > 0) {
    res
      .status(409)
      .json({ error: "Cannot delete product with existing stock" }); // NEW ERROR CODE
    return;
  }

  products.splice(index, 1);
  res.status(204).send();
});

app.patch("/api/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  // Simple partial update
  if (req.body.price !== undefined) {
    if (req.body.price <= 0) {
      res.status(422).json({ error: "Price must be greater than 0" }); // NEW ERROR CODE
      return;
    }
    product.price = req.body.price;
  }

  res.json(product);
});

const port = Number(process.env.PORT ?? 3000);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`E-commerce API listening on... ${port}`);
  });
}

export { app };
