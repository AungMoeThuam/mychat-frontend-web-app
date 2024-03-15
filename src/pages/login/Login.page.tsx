import homebackground from "../../assets/homebackground.svg";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import { loginAction } from "../../redux/actions/authThunks";
import { RootState, StoreDispatch } from "../../redux/store/store";

export default function LoginPage() {
  const navigate = useNavigate();
  const { error, loading, success, message } = useSelector(
    (state: RootState) => state.authSlice
  );
  const diapatch = useDispatch<StoreDispatch>();

  //getting from from user input
  const [form, setForm] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const onChange: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const login: FormEventHandler = (e: FormEvent) => {
    e.preventDefault();
    diapatch(loginAction(form));
  };
  useEffect(() => {
    if (success === true) navigate("/");
  }, [success]);
  return (
    <div className="h-screen bg-slate-950">
      <main className=" h-full  px-2 md:px-18 lg:px-40 py-10 flex justify-center md:grid grid-cols-12  ">
        <section className=" hidden col-span-6 md:flex  lg:flex flex-col  justify-center align-middle ">
          <h1 className="">MyChat</h1>
          <img
            className=" object-cover"
            loading="lazy"
            alt="background"
            src={homebackground}
          />
        </section>
        <section className=" h-full col-span-12 flex flex-col justify-center md:col-span-6  px-6 md:px-8 lg:px-10 ">
          <h1 className=" text-2xl font-bold">Login</h1>
          <form
            onSubmit={login}
            className=" px-4  py-2 flex flex-col gap-2 text-sm "
          >
            <label htmlFor="email">Email</label>
            <input
              required
              className="rounded-md border p-2 bg-slate-100 "
              type="email"
              name="email"
              id="email"
              placeholder="example@email.com"
              onChange={onChange}
            />
            <label htmlFor="password">Password</label>
            <input
              required
              className="rounded-md border p-2 bg-slate-100"
              type="password"
              name="password"
              id="password"
              placeholder="..."
              onChange={onChange}
            />
            {error === true && (
              <p className=" text-red-500 font-bold">{message}</p>
            )}
            <input
              className=" btn btn-md bg-teal-900 font-bold text-white p-2 cursor-pointer"
              type="submit"
              value={loading === true ? "loading...." : "Login"}
            />
            <Link to={"/register"}>Registered?</Link>
          </form>
        </section>
      </main>
    </div>
  );
}
