export default function RequestsPage() {
  return (
    <div className="  flex-1 flex flex-col gap-1 overflow-y-scroll px-4 pt-3 pb-5">
      {Array.from({ length: 100 }).map((item, index) => {
        return (
          <div className="flex  gap-2  justify-between p-2 rounded  items-center pr-4 hover:bg-teal-900">
            <div className="flex gap-2">
              <img
                className=" avatar w-10 h-10 rounded-full"
                src="https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962.jpg?w=1260&h=928"
              />

              <div>
                <h1>Name</h1>
                <small>Offline</small>
              </div>
            </div>
            <div className="flex gap-4">
              <button className=" btn btn-sm bg-teal-500 border-none text-black">
                Accept
              </button>
              <button className=" btn btn-sm  bg-slate-950 border-none text-slate-400">
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
