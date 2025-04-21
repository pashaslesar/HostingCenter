import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/store/auth";
import "../../styles.css";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = user !== null;

  const handleStart = () => {
    if (isLoggedIn) {
      navigate("/dashboard/hosting");
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <section className="order">
      <img src="/images/line.png" alt="čára" className="line" />

      <div className="container">
        <div className="common-title">Objednejte si doménu</div>

        <img
          src="/images/breadcrumbs.png"
          alt="navigační drobečky"
          className="order-bg-image"
        />

        <div className="order-block">
          <div className="order-form">
            <div className="order-form-text">
              Vítejte na stránkách <strong>UPCE Hosting</strong>!<br />
              Nabízíme vám možnost snadno a rychle vytvořit vlastní hosting, doménu a databázi v rámci univerzitního prostředí.
              <br /><br />
              Vše běží automaticky, přehledně a v moderním designu.
              <br /><br />
              🍪 Hosting zdarma pro studenty. A sušenky navrch.
            </div>

            <div style={{ marginTop: "32px" }}>
              <button className="button violet-button" onClick={handleStart}>
                Začít zdarma
              </button>
            </div>
          </div>

          <div className="order-block-image">
            <img src="/images/order.png" alt="Sušenky" className="order-image" />
          </div>
        </div>
        <div className="rights">Všechna práva nejsou chráněna</div>
      </div>
    </section>
  );
};

export default Home;
