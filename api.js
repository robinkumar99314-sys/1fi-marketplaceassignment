const BASE = "/api/products";

export async function getProducts() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function getProduct(slug) {
  const res = await fetch(`${BASE}/${slug}`);
  if (!res.ok) throw new Error("Failed to load product");
  return res.json();
}

export async function getEmiPlans(slug, variantId) {
  const res = await fetch(`${BASE}/${slug}/variants/${variantId}/emi-plans`);
  if (!res.ok) throw new Error("Failed to load EMI plans");
  return res.json();
}

export const formatINR = (n) => "₹" + Number(n).toLocaleString("en-IN");
