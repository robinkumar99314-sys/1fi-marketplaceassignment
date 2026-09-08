import TopBar from "../components/TopBar.jsx";

export default function Home() {
  return (
    <>
      <TopBar />
      <div className="m-10 bg-white rounded-2xl p-10 text-center text-onefi-muted">
        <div className="text-3xl mb-2">🏠</div>
        <div className="font-bold text-[#17151F] mb-1">Home</div>
        <div>Head to the Shop tab to browse the 1Fi Marketplace.</div>
      </div>
    </>
  );
}
