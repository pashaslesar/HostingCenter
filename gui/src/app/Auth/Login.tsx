import React from "react";
import toast from "react-hot-toast/headless";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { LoginData, signIn } from "../../shared/store/auth";
import { ToastDanger, ToastSuccess } from "../../shared/components/Toasts";
import "../../styles.css";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const login = (data: LoginData) => {
    signIn(data).then(() => {
      toast(t("general.signin"), { className: ToastSuccess });
      if (searchParams.has("domain") && searchParams.has("plan")) {
        navigate("/domain?" + searchParams.toString());
      } else {
        navigate("/dashboard?" + searchParams.toString());
      }
    }).catch(e => {
      toast(t("page.login.error." + e.message), { className: ToastDanger });
    });
  };

  return (
    <>
      <section className="order">
        {/* Фоновые изображения */}
        <img src="/images/line.png" alt="čára" className="line" />
        <img src="/images/breadcrumbs.png" alt="drobečky" className="order-bg-image" />

        <div className="container">
          <div className="common-title">{t("page.login.header")}</div>

          <div className="order-block">
            <div className="order-form">
              <div className="order-form-text">
                двоырад
              </div>
              <div className="order-form-inputs">
                <form onSubmit={handleSubmit(login)}>
                  <input
                    type="email"
                    placeholder={t("page.login.email")}
                    autoComplete="email"
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500">{t("page.login.error.required")}</span>
                  )}

                  <input
                    type="password"
                    placeholder={t("page.login.password")}
                    autoComplete="current-password"
                    {...register("password", { required: true })}
                  />
                  {errors.password && (
                    <span className="text-xs text-red-500">{t("page.login.error.required")}</span>
                  )}

                  <button className="button violet-button" type="submit">
                    {t("page.login.submit")}
                  </button>
                </form>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                  <NavLink
                    to={"/auth/register?" + searchParams.toString()}
                    style={{ fontSize: "16px", color: "white", textDecoration: "underline" }}
                  >
                    {t("page.login.create")}
                  </NavLink>

                  <NavLink
                    to={"/auth/recovery?" + searchParams.toString()}
                    style={{ fontSize: "16px", color: "white", textDecoration: "underline" }}
                  >
                    {t("page.login.recovery")}
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Правая часть — изображение как на главной */}
            <div className="order-block-image">
              <img src="/images/order.png" alt="Sušenky" className="order-image" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
