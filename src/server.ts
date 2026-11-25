import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  category: z.string().optional(),
});

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category?: string;
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

app.get("/api/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(product);
});

const port = Number(process.env.PORT ?? 3000);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Product API listening on port ${port}`);
  });
}

export { app };
