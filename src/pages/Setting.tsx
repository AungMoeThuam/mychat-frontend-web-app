import { useEffect, useState } from "react";

export default function Setting() {
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    let savedDarkMode = localStorage.getItem("mode");
    if (savedDarkMode !== "dark") setDarkMode(false);
  }, []);
  return (
    <div className="p-5 text-zinc-950 dark:text-lime-500">
      <h1 className=" text-xl font-bold mb-4">Setting</h1>
      <div>
        <div className="flex flex-col gap-2 card ">
          <h2 className="text-lg font-semibold">Color Mode</h2>
          <div className="flex gap-3">
            <p>Light</p>
            <input
              checked={darkMode}
              type="checkbox"
              className="toggle bg-lime-500"
              onChange={() => {
                setDarkMode((prev) => !prev);
                let isAlreadyDarkMode = document.body
                  .querySelector("#root")
                  ?.classList.contains("dark");

                if (isAlreadyDarkMode) {
                  localStorage.removeItem("mode");
                  return document.body
                    .querySelector("#root")
                    ?.classList.remove("dark");
                }
                localStorage.setItem("mode", "dark");
                document.body.querySelector("#root")?.classList.add("dark");
              }}
            />
            <p>Dark</p>
          </div>
        </div>
      </div>
    </div>
  );
}
