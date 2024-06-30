export default function Setting() {
  return (
    <div className="p-5">
      <h1 className="  text-xl font-bold mb-4">Setting</h1>
      <div>
        <div className="flex flex-col gap-2 card ">
          <h2 className="text-lg font-semibold">Color Mode</h2>
          <div className="flex gap-3">
            <p>Dark</p>
            <input type="checkbox" className="toggle bg-lime-500" />
            <p>Light</p>
          </div>
        </div>
      </div>
    </div>
  );
}
