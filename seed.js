const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// EMI tenures per the assignment reference: 3, 6, 12, 24 months at 0%,
// 36/48/60 months at 10.5%, flat ₹7,500 cashback on every plan (mirrors
// the reference screenshot). We additionally keep a 9-month 0% tier and
// mark one plan "recommended" per variant so the UI has a sensible default.
function buildEmiPlans(price) {
  const tiers = [
    { tenureMonths: 3, interestRate: 0 },
    { tenureMonths: 6, interestRate: 0 },
    { tenureMonths: 9, interestRate: 0 },
    { tenureMonths: 12, interestRate: 0 },
    { tenureMonths: 24, interestRate: 10.5 },
  ];
  return tiers.map((t, i) => {
    const totalPayable = t.interestRate === 0
      ? price
      : price * (1 + (t.interestRate / 100) * (t.tenureMonths / 12));
    return {
      tenureMonths: t.tenureMonths,
      monthlyAmount: Math.round(totalPayable / t.tenureMonths),
      interestRate: t.interestRate,
      cashbackAmount: t.tenureMonths === 3 ? Math.round(price * 0.01) : 0,
      isRecommended: t.tenureMonths === 9,
    };
  });
}

const products = [
  {
    slug: "iphone-17-pro",
    name: "Apple iPhone 17 Pro",
    brand: "Apple",
    description: "The most advanced iPhone yet, with a pro camera system and A19 Pro chip.",
    variants: [
      { size: "256GB", color: "Deep Blue", mrp: 139900, price: 134900, imageUrl: "/products/iphone-17-pro/blue.jpg" },
      { size: "256GB", color: "Cosmic Orange", mrp: 139900, price: 134900, imageUrl: "/products/iphone-17-pro/orange.jpg" },
      { size: "512GB", color: "Cosmic Orange", mrp: 159900, price: 154900, imageUrl: "/products/iphone-17-pro/orange-alt.jpg" },
    ],
  },
  {
    slug: "samsung-galaxy-s25-ultra",
    name: "Samsung Galaxy S25 Ultra",
    brand: "Samsung",
    description: "Galaxy AI in your pocket, with a built-in S Pen and pro-grade camera.",
    variants: [
      { size: "256GB", color: "Titanium Black", mrp: 129999, price: 124999, imageUrl: "/products/galaxy-s25-ultra/black.jpg" },
      { size: "512GB", color: "Titanium Gray", mrp: 144999, price: 139999, imageUrl: "/products/galaxy-s25-ultra/titanium-gray.jpg" },
      { size: "1TB", color: "Titanium Black", mrp: 164999, price: 159999, imageUrl: "/products/galaxy-s25-ultra/black.jpg" },
    ],
  },
  {
    slug: "google-pixel-10-pro",
    name: "Google Pixel 10 Pro",
    brand: "Google",
    description: "Built by Google. Pro-level camera, Google AI, and the Tensor G5 chip.",
    variants: [
      { size: "128GB", color: "Obsidian", mrp: 99999, price: 94999, imageUrl: "/products/pixel-10-pro/obsidian.jpg" },
      { size: "256GB", color: "Porcelain", mrp: 109999, price: 104999, imageUrl: "/products/pixel-10-pro/porcelain.jpg" },
      { size: "512GB", color: "Obsidian", mrp: 124999, price: 119999, imageUrl: "/products/pixel-10-pro/obsidian.jpg" },
    ],
  },
  {
    slug: "macbook-air",
    name: "MacBook Air",
    brand: "Apple",
    description: "Strikingly thin design powered by the Apple M-series chip.",
    variants: [
      { size: "256GB", color: "Silver", mrp: 114900, price: 109900, imageUrl: "/products/macbook-air/silver.jpg" },
      { size: "256GB", color: "Midnight", mrp: 114900, price: 109900, imageUrl: "/products/macbook-air/midnight.jpg" },
      { size: "512GB", color: "Starlight", mrp: 134900, price: 129900, imageUrl: "/products/macbook-air/starlight.jpg" },
    ],
  },
  {
    slug: "sony-bravia-4k-smart-tv",
    name: "Sony Bravia 4K Smart TV",
    brand: "Sony",
    description: "XR processor, Dolby Vision Atmos, and Google TV in a stunning 4K panel.",
    variants: [
      { size: "55 inch", color: "Black", mrp: 89990, price: 79990, imageUrl: "/products/sony-bravia-tv/55.jpg" },
      { size: "65 inch", color: "Black", mrp: 179990, price: 159990, imageUrl: "/products/sony-bravia-tv/65.jpg" },
      { size: "75 inch", color: "Black", mrp: 249990, price: 224990, imageUrl: "/products/sony-bravia-tv/75.jpg" },
    ],
  },
];

async function main() {
  console.log("Seeding...");
  // Clean slate so re-running seed doesn't duplicate rows
  await prisma.eMIPlan.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  for (const p of products) {
    const created = await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        description: p.description,
      },
    });

    for (const v of p.variants) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: created.id,
          size: v.size,
          color: v.color,
          mrp: v.mrp,
          price: v.price,
          imageUrl: v.imageUrl,
        },
      });

      const plans = buildEmiPlans(v.price);
      await prisma.eMIPlan.createMany({
        data: plans.map((plan) => ({ ...plan, variantId: variant.id })),
      });
    }
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
