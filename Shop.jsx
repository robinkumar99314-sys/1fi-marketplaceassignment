import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";

function OptionCard({ icon, title, sub, disabled, onClick }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`bg-white rounded-2xl p-[18px] flex items-center gap-3.5 shadow-[0_2px_10px_rgba(20,10,50,0.05)] ${
        disabled ? "opacity-55" : "cursor-pointer active:scale-[0.98]"
      }`}
    >
      <div className="w-[46px] h-[46px] rounded-2xl bg-onefi-purpleLight text-onefi-purple flex items-center justify-center text-xl shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-bold text-[15px]">{title}</div>
        <div className="text-[12.5px] text-onefi-muted mt-0.5">{sub}</div>
      </div>
      <div className="text-onefi-muted text-lg">›</div>
    </div>
  );
}

export default function Shop() {
  const navigate = useNavigate();
  return (
    <>
      <TopBar title="Shop" />
      <div className="section-title">Shop with 1Fi</div>
      <div className="flex flex-col gap-3 px-4">
        <OptionCard icon="🏷️" title="Top Brands" sub="Coming soon" disabled />
        <OptionCard icon="📍" title="Nearby Stores" sub="Coming soon" disabled />
        <OptionCard
          icon="🛒"
          title="1Fi Marketplace"
          sub="Shop electronics on no-cost EMI"
          onClick={() => navigate("/shop/marketplace")}
        />
      </div>
    </>
  );
}
