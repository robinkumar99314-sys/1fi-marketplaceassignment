import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import { getProducts, formatINR } from "../api.js";

export default function Marketplace() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts().then(setProducts).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <TopBar title="1Fi Marketplace" showBack />
      <div className="section-title">Available on EMI</div>

      {error && <div className="mx-4 text-sm text-red-600">{error}</div>}
      {!products && !error && <div className="text-center py-16 text-onefi-muted">Loading products…</div>}

      {products && (
        <div className="grid grid-cols-2 gap-3 px-4">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/products/${p.slug}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(20,10,50,0.05)] cursor-pointer"
            >
              <div className="h-[130px] flex items-center justify-center p-2.5">
                <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="px-3 pb-3.5">
                <div className="text-[10.5px] text-onefi-muted uppercase tracking-wide">{p.brand}</div>
                <div className="text-[13.5px] font-bold my-0.5 leading-tight">{p.name}</div>
                <div className="text-sm font-extrabold text-onefi-purpleDark">
                  {formatINR(p.startingPrice)} <small className="font-medium text-onefi-muted text-[11px]">onwards</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
