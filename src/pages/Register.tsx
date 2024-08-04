import { useDispatch, useSelector } from "react-redux";
import homebackground from "../assets/photos/homebackground.svg";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { RootState, StoreDispatch } from "../redux/store/store";
import { registerUser } from "../redux/features/user/userThunks";
import { Link, useNavigate } from "react-router-dom";
import { RegisterForm } from "../lib/types/types";
import Input from "../components/share-components/Input";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
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
    dispatch(registerUser(form));
  };

  useEffect(() => {
    if (success === true) navigate("/");
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
      <section className="flex-1  px-6 md:px-8 lg:px-10  ">
        <div className="text-lime-500">
          <h1 className=" text-2xl font-bold">Registeration</h1>
          <p className=" text-lg font-semibold">
            Join MyChat to stay close with your friends!
          </p>
        </div>
        <form
          onSubmit={onRegister}
          className=" px-4  py-2 flex flex-col gap-2 text-sm "
        >
          <Input name="Name" type="text" onChange={onChange} />
          <Input name="Email" type="email" onChange={onChange} />
          <Input name="Password" type="password" onChange={onChange} />
          <Input name="Confirm Password" type="password" onChange={onChange} />
          {error === true && (
            <p className=" text-red-500 font-bold">{message}</p>
          )}
          <input
            className=" btn border-none  secondary text-zinc-950"
            type="submit"
            disabled={loading}
            value={loading === true ? "Loading...." : "Register"}
          />
          <Link
            className="  font-semibold text-lime-500 underline"
            to={"/login"}
          >
            Login
          </Link>
        </form>
      </section>
    </main>
  );
}
