import toast from "react-hot-toast";

export default function UserIdDisplayer(props: { currentUserId: string }) {
  const { currentUserId } = props;
  return (
    <div className="flex  items-center gap-3">
      <h1 className=" font-mono text-slate-500">
        id - <b>{currentUserId}</b>
      </h1>
      <button
        onClick={() => {
          navigator.clipboard.writeText(currentUserId).then(() =>
            toast.success("copied id", {
              style: {
                border: "1px solid #713200",
                padding: "16px",
                color: "#713200",
              },
              iconTheme: {
                primary: "#713200",
                secondary: "#FFFAEE",
              },
            })
          );
        }}
        className="btn btn-sm bg-teal-800"
      >
        copy id
      </button>
    </div>
  );
}
