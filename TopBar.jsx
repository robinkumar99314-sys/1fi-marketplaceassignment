import { useNavigate } from "react-router-dom";

export default function TopBar({ title, showBack }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between p-4">
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-lg"
        >
          ←
        </button>
      ) : (
        <span className="font-extrabold text-xl text-onefi-purpleDark">1Fi</span>
      )}
      <span className="font-bold text-[15px]">{title}</span>
      <span className="w-9" />
    </div>
  );
}
