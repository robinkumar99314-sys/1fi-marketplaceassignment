import { Routes, Route, Navigate } from "react-router-dom";
import BottomNav from "./components/BottomNav.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Confirm from "./pages/Confirm.jsx";
import Placeholder from "./pages/Placeholder.jsx";

export default function App() {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-onefi-bg pb-24 relative">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/marketplace" element={<Marketplace />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/emi-dues" element={<Placeholder title="EMI Dues" />} />
        <Route path="/limit" element={<Placeholder title="Limit" />} />
        <Route path="/profile" element={<Placeholder title="Profile" />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
