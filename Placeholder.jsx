import TopBar from "../components/TopBar.jsx";

export default function Placeholder({ title }) {
  return (
    <>
      <TopBar title={title} />
      <div className="m-10 bg-white rounded-2xl p-10 text-center text-onefi-muted">
        <div className="text-3xl mb-2">•••</div>
        <div className="font-bold text-[#17151F] mb-1">Nothing here yet</div>
        <div>This section isn't part of the current build.</div>
      </div>
    </>
  );
}
