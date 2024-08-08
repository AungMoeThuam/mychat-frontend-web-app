import homebackground from "../assets/photos/homebackground.svg";
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
import { loginUser } from "../redux/features/user/userThunks";
import { RootState, StoreDispatch } from "../redux/store/store";
import Input from "../components/share-components/Input";
import { resetAuth } from "../redux/features/user/userSlice";
type LoginCredential = {
  email: string;
  password: string;
};
export default function LoginPage() {
  const navigate = useNavigate();
  const { error, loading, success, message } = useSelector(
    (state: RootState) => state.authSlice
  );
  const diapatch = useDispatch<StoreDispatch>();

  //getting from from user input
  const [form, setForm] = useState<LoginCredential>({
    email: "",
    password: "",
  });

  const onChange: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const login: FormEventHandler = (e: FormEvent) => {
    console.log(form);
    e.preventDefault();
    diapatch(loginUser(form));
  };

  useEffect(() => {
    if (success === true) navigate("/");

    return () => {
      diapatch(resetAuth());
    };
  }, [success]);

  return (
    <main className=" primary-dark px-10 md:px-20 lg:px-40 w-[100dvw] h-[100dvh] flex justify-center items-center">
      <section className=" flex-1 hidden  md:flex flex-col gap-10  ">
        <h1 className=" text-4xl text-lime-500">MyChat Messenger</h1>
        <img
          className="object-cover"
          loading="lazy"
          alt="background"
          src={homebackground}
        />
      </section>
      <section className=" flex-1 flex flex-col justify-center  px-6 md:px-8 lg:px-10 ">
        <h1 className=" text-2xl font-bold text-lime-500">Login</h1>
        <form
          onSubmit={login}
          className=" px-4  py-2 flex flex-col gap-2 text-sm "
        >
          <Input
            name="email"
            type="email"
            onChange={onChange}
            placeholder="example@example.com"
          />
          <Input
            name="password"
            type="password"
            onChange={onChange}
            placeholder="..."
          />
          {error === true && (
            <p className=" text-red-500 font-bold">{message}</p>
          )}
          <input
            className=" btn btn-md secondary font-bold text-zinc-950 p-2 cursor-pointer"
            type="submit"
            value={loading === true ? "loading...." : "Login"}
          />
          <Link className=" text-lime-500 underline" to={"/register"}>
            not Registered yet?
          </Link>
        </form>
      </section>
    </main>
  );
}
