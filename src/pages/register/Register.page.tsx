import { useDispatch, useSelector } from "react-redux";
import homebackground from "../../assets/homebackground.svg";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { RootState, StoreDispatch } from "../../redux/store/store";
import { registerAction } from "../../redux/actions/authThunks";
import { Link, useNavigate } from "react-router-dom";
import { RegisterForm } from "../../utils/types";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch<StoreDispatch>();
  const { loading, success, error, message } = useSelector(
    (state: RootState) => state.authSlice
  );

  const onChange: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onRegister: FormEventHandler<HTMLFormElement> = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    dispatch(registerAction(form));
  };

  useEffect(() => {
    if (success === true) navigate("/");
  }, [success]);

  return (
    <>
      <h1>MyChat</h1>
      <main className="   px-2 md:px-18 lg:px-40 py-10 flex justify-center md:grid grid-cols-12  ">
        <section className=" hidden col-span-6 md:flex  lg:flex justify-center align-middle ">
          <img
            className=" object-cover"
            loading="lazy"
            alt="background"
            src={homebackground}
          />
        </section>
        <section className="col-span-12 md:col-span-6 px-6 md:px-8 lg:px-10 ">
          <h1 className=" text-2xl font-bold">Registeration</h1>
          <p className=" text-lg font-semibold">
            Join MyChat to stay close with your friends!
          </p>
          <form
            onSubmit={onRegister}
            className=" px-4  py-2 flex flex-col gap-2 text-sm "
          >
            <label htmlFor="name">Name</label>
            <input
              required
              className="border p-2 bg-slate-100"
              type="text"
              name="name"
              id="name"
              placeholder="david"
              onChange={onChange}
            />
            <label htmlFor="email">Email</label>
            <input
              required
              className="border p-2 bg-slate-100"
              type="email"
              name="email"
              id="email"
              placeholder="example@email.com"
              onChange={onChange}
            />{" "}
            <label htmlFor="phone">Phone</label>
            <input
              className="border p-2 bg-slate-100"
              type="text"
              name="phone"
              id="phone"
              placeholder="+959901291211"
              onChange={onChange}
            />{" "}
            <label htmlFor="password">Password</label>
            <input
              required
              className="border p-2 bg-slate-100"
              type="password"
              name="password"
              id="password"
              placeholder="..."
              onChange={onChange}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              required
              className="border p-2 bg-slate-100"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="..."
              onChange={onChange}
            />
            {error === true && (
              <p className=" text-red-500 font-bold">{message}</p>
            )}
            <input
              className=" bg-yellow-400 p-2 cursor-pointer"
              type="submit"
              value={loading === true ? "loading...." : "register"}
            />
            <Link to={"/login"}>Login</Link>
          </form>
        </section>
      </main>
    </>
  );
}
