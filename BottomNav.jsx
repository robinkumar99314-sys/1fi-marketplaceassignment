import { NavLink, useLocation } from "react-router-dom";

const items = [
  { to: "/home", icon: "🏠", label: "Home" },
  { to: "/shop", icon: "🛍️", label: "Shop", matchPrefixes: ["/shop", "/products", "/confirm"] },
  { to: "/emi-dues", icon: "🧾", label: "EMI Dues" },
  { to: "/limit", icon: "📈", label: "Limit" },
  { to: "/profile", icon: "👤", label: "Profile" },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[448px] bg-white rounded-[20px] shadow-[0_6px_24px_rgba(20,10,50,0.12)] flex justify-around py-2.5 px-1">
      {items.map((item) => {
        const active = item.matchPrefixes
          ? item.matchPrefixes.some((p) => pathname.startsWith(p))
          : pathname === item.to;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={`flex-1 flex flex-col items-center gap-0.5 text-[10.5px] ${
              active ? "text-onefi-purple font-bold" : "text-onefi-muted"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
