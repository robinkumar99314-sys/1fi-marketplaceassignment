import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import { getProduct, getEmiPlans, formatINR } from "../api.js";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [emiPlans, setEmiPlans] = useState(null);
  const [selectedEmiId, setSelectedEmiId] = useState(null);

  // Load the product once
  useEffect(() => {
    setProduct(null);
    setEmiPlans(null);
    setSelectedEmiId(null);
    getProduct(slug)
      .then((p) => {
        setProduct(p);
        setSelectedVariantId(p.variants[0]?.id ?? null);
      })
      .catch((e) => setError(e.message));
  }, [slug]);

  // Load EMI plans whenever the selected variant changes
  useEffect(() => {
    if (!product || !selectedVariantId) return;
    setEmiPlans(null);
    setSelectedEmiId(null);
    getEmiPlans(slug, selectedVariantId).then((plans) => {
      setEmiPlans(plans);
      const rec = plans.find((p) => p.isRecommended) || plans[0];
      setSelectedEmiId(rec?.id ?? null);
    });
  }, [selectedVariantId, product, slug]);

  if (error) return <><TopBar showBack /><div className="mx-4 text-onefi-muted">Product not found.</div></>;
  if (!product) return <><TopBar showBack /><div className="text-center py-16 text-onefi-muted">Loading product…</div></>;

  const variant = product.variants.find((v) => v.id === selectedVariantId);
  const discount = Math.round(100 - (variant.price / variant.mrp) * 100);
  const selectedEmi = emiPlans?.find((e) => e.id === selectedEmiId);

  return (
    <>
      <TopBar showBack />

      <div className="mx-4 bg-white rounded-2xl p-6 flex items-center justify-center shadow-[0_2px_10px_rgba(20,10,50,0.05)]">
        <img src={variant.imageUrl} alt={product.name} className="max-w-full max-h-64 object-contain" />
      </div>

      <div className="p-4">
        <div className="text-xs text-onefi-muted uppercase tracking-wide">{product.brand}</div>
        <div className="text-xl font-extrabold my-1">{product.name}</div>
        <div className="text-[13px] text-onefi-muted leading-relaxed mb-3.5">{product.description}</div>

        <div className="flex items-baseline gap-2.5 mb-4">
          <div className="text-[22px] font-extrabold">{formatINR(variant.price)}</div>
          <div className="text-sm text-onefi-muted line-through">{formatINR(variant.mrp)}</div>
          {discount > 0 && <div className="text-xs text-green-600 font-bold">{discount}% off</div>}
        </div>

        <div className="section-title !mx-0">Select Variant</div>
        <div className="flex gap-2.5 flex-wrap mb-5">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariantId(v.id)}
              className={`border-[1.5px] rounded-xl px-3.5 py-2 text-[13px] font-semibold ${
                v.id === selectedVariantId
                  ? "border-onefi-purple text-onefi-purple bg-onefi-purpleLight"
                  : "border-[#E4E1EC] bg-white"
              }`}
            >
              {v.size} · {v.color}
            </button>
          ))}
        </div>

        <div className="section-title !mx-0">Choose EMI Plan</div>
        {!emiPlans && <div className="text-onefi-muted text-sm mb-4">Loading EMI plans…</div>}
        <div className="flex flex-col gap-2.5 mb-5">
          {emiPlans?.map((e) => (
            <div
              key={e.id}
              onClick={() => setSelectedEmiId(e.id)}
              className={`border-[1.5px] rounded-[14px] p-3.5 flex items-center justify-between cursor-pointer ${
                e.id === selectedEmiId ? "border-onefi-purple bg-onefi-purpleLight" : "border-[#E4E1EC] bg-white"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-[18px] h-[18px] rounded-full border-2 mr-2.5 shrink-0 relative ${
                    e.id === selectedEmiId ? "border-onefi-purple" : "border-[#C9C3D6]"
                  }`}
                >
                  {e.id === selectedEmiId && (
                    <div className="absolute inset-[3px] rounded-full bg-onefi-purple" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="font-bold text-sm">
                    {e.tenureMonths} months
                    {e.isRecommended && (
                      <span className="ml-1.5 text-[10px] font-bold text-onefi-purple bg-onefi-purpleLight px-1.5 py-0.5 rounded">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <div className="text-[11.5px] text-onefi-muted">
                    {e.interestRate === 0 ? "0% interest" : `${e.interestRate}% interest`}
                    {e.cashbackAmount > 0 && (
                      <> · <span className="text-green-600">{formatINR(e.cashbackAmount)} cashback</span></>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-[15px]">
                  {formatINR(e.monthlyAmount)}<small className="font-medium text-[10.5px] text-onefi-muted">/mo</small>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          disabled={!selectedEmi}
          onClick={() => navigate("/confirm", { state: { product, variant, emi: selectedEmi } })}
          className="w-full bg-onefi-purple disabled:bg-[#C9C3D6] text-white rounded-2xl py-4 font-bold"
        >
          Proceed
        </button>
      </div>
    </>
  );
}
