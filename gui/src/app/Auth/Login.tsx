import React from "react";
import toast from "react-hot-toast/headless";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { LoginData, signIn } from "../../shared/store/auth";
import { ToastDanger, ToastSuccess } from "../../shared/components/Toasts";
import "../../styles.css";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const login = (data: LoginData) => {
    signIn(data).then(() => {
      toast("Přihlášení úspěšné", { className: ToastSuccess });
      if (searchParams.has("domain") && searchParams.has("plan")) {
        navigate("/domain?" + searchParams.toString());
      } else {
        navigate("/dashboard?" + searchParams.toString());
      }
    }).catch(e => {
      toast("Chyba při přihlášení", { className: ToastDanger });
    });
  };

  return (
    <>
      <section className="order">
        <img src="/images/line.png" alt="čára" className="line" />
        <img src="/images/breadcrumbs.png" alt="drobečky" className="order-bg-image" />

        <div className="container">
          <div className="common-title">Přihlášení</div>

          <div className="order-block">
            <div className="order-form">
              <div className="order-form-text">
                Přihlašte se do svého účtu UPCEHosting.
              </div>
              <div className="order-form-inputs">
                <form onSubmit={handleSubmit(login)}>
                  <input
                    type="email"
                    placeholder="E-mail"
                    autoComplete="email"
                    {...register("email", { required: true })}
                  />
                  <input
                    type="password"
                    placeholder="Heslo"
                    autoComplete="current-password"
                    {...register("password", { required: true })}
                  />
                  <button className="button violet-button" type="submit">
                    Přihlásit se
                  </button>
                </form>
                <NavLink to="/auth/recovery" className="mt-2 underline hover:no-underline">
                  Zapomněli jste heslo?
                </NavLink>
              </div>
            </div>
            <div className="order-block-image">
              <img src="/images/order.png" alt="Sušenky" className="order-image" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
