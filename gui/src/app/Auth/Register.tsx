import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast/headless";
import { useNavigate, useSearchParams, NavLink } from "react-router-dom";
import BaseHttpService from "../../shared/data/util/BaseHttpService";
import { ToastDanger, ToastSuccess } from "../../shared/components/Toasts";
import "../../styles.css"; // твои кастомные стили

export default function Register() {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const confirmation = async (value: string) => {
    if (watch('password') !== value) return "Passwords do not match";
  };

  const create = (data: any) => {
    const payload = JSON.stringify(data);
    BaseHttpService.fetch('/users', {
      method: 'POST',
      body: payload,
    }).then(() => {
      toast(t("page.register.success"), { className: ToastSuccess });
      navigate("/auth/login?" + searchParams.toString());
    }).catch((e: any) => {
      console.error(e);
      toast(t("page.register.error." + e.message), { className: ToastDanger });
    });
  };

  return (
    <>
      <section className="order">
        <img src="/images/line.png" alt="čára" className="line" />
        <div className="container">
          <div className="common-title">{t("Založení učtu")}</div>
          <img src="/images/breadcrumbs.png" alt="drobečky" className="order-bg-image" />

          <div className="order-block">
            <div className="order-form">
              <form onSubmit={handleSubmit(create)} className="order-form-inputs">

                <input type="text" placeholder={t("Jméno")} {...register("first_name", { required: true })} />
                {errors.first_name && <span className="text-xs text-red-500">Required</span>}

                <input type="text" placeholder={t("Přijmení")} {...register("last_name", { required: true })} />
                {errors.last_name && <span className="text-xs text-red-500">Required</span>}

                <input type="text" placeholder={t("Username")} {...register("display", { required: true })} />
                {errors.display && <span className="text-xs text-red-500">Required</span>}

                <input type="email" placeholder={t("Email")} {...register("email", { required: true })} />
                {errors.email && <span className="text-xs text-red-500">Required</span>}

                <input type="text" placeholder={t("Telefonní číslo")} {...register("phone")} />

                <input type="password" placeholder={t("Heslo")} {...register("password", { required: true })} />
                {errors.password && <span className="text-xs text-red-500">Required</span>}

                <input type="password" placeholder={t("Confirm password")} {...register("confirmation", {
                  required: true,
                  validate: { confirmation }
                })} />
                {errors.confirmation?.type === "required" && <span className="text-xs text-red-500">Required</span>}
                {errors.confirmation?.type === "confirmation" && <span className="text-xs text-red-500">Passwords must match</span>}

                <button className="button violet-button" type="submit">{t("Registrace")}</button>

                <NavLink to="/auth/login?" className="button" style={{ width: "387px", height: "71px", marginTop: "16px", textAlign: "center", display: "block", lineHeight: "35px" }}>
                  Zpět na přihlášení
                </NavLink>
              </form>
            </div>

            <div className="order-block-image">
              <img src="/images/order.png" alt="Sušenky" className="order-image" />
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="rights">© 2025, UPCE</div>
      </footer>
    </>
  );
}
