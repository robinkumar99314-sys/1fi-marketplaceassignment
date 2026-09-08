const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/products
// Returns a lightweight list for the Marketplace grid.
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { variants: { orderBy: { price: "asc" } } },
      orderBy: { createdAt: "asc" },
    });

    const summary = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      description: p.description,
      startingPrice: Math.min(...p.variants.map((v) => v.price)),
      image: p.variants[0]?.imageUrl ?? null,
    }));

    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load products" });
  }
});

// GET /api/products/:slug
// Full product detail including all variants (each variant embeds its own emiPlans).
router.get("/:slug", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        variants: {
          include: { emiPlans: { orderBy: { tenureMonths: "asc" } } },
        },
      },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load product" });
  }
});

// GET /api/products/:slug/variants/:variantId/emi-plans
router.get("/:slug/variants/:variantId/emi-plans", async (req, res) => {
  try {
    const { slug, variantId } = req.params;
    const variant = await prisma.productVariant.findFirst({
      where: { id: variantId, product: { slug } },
      include: { emiPlans: { orderBy: { tenureMonths: "asc" } } },
    });
    if (!variant) return res.status(404).json({ error: "Variant not found" });
    res.json(variant.emiPlans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load EMI plans" });
  }
});

module.exports = router;
