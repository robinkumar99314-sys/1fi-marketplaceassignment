import { useLocation, useNavigate } from "react-router-dom";
import { formatINR } from "../api.js";
import TopBar from "../components/TopBar.jsx";

export default function Confirm() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/shop/marketplace", { replace: true });
    return null;
  }

  const { product, variant, emi } = state;

  return (
    <>
      <TopBar showBack />
      <div className="text-center px-6 py-14">
        <div className="w-16 h-16 rounded-full bg-onefi-purpleLight text-onefi-purple flex items-center justify-center text-3xl mx-auto mb-4">
          ✓
        </div>
        <div className="text-lg font-extrabold mb-2">Request received</div>
        <div className="text-onefi-muted text-[13.5px] leading-relaxed mb-6">
          {product.name} ({variant.size} · {variant.color})<br />
          {emi.tenureMonths}-month plan · {formatINR(emi.monthlyAmount)}/mo
        </div>
        <div className="text-onefi-muted text-xs">
          This is a demo confirmation — no payment or KYC has been processed.
        </div>
      </div>
      <button
        onClick={() => navigate("/shop/marketplace")}
        className="w-[calc(100%-32px)] mx-4 bg-onefi-purple text-white rounded-2xl py-4 font-bold"
      >
        Back to Marketplace
      </button>
    </>
  );
}
