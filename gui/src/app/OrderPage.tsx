import React from "react";
import "../styles.css"; // Подключаем твои стили (если style.css лежит рядом или в src/)

export const OrderPage = () => {
  return (
    <section className="order">
      <img src="../../public/images/line.png" alt="čára" className="line" />
      <div className="container">
        <div className="common-title">Objednejte si doménu</div>
        <img
          src="../../public/images/breadcrumbs.png"
          alt="navigační drobečky"
          className="order-bg-image"
        />
        <div className="order-block">
          <div className="order-form">
            <div className="order-form-text">
              Objednejte si naši zasranou doménu. Pak vám ji ukradneme. Sušenky jako dárek.
            </div>
            <div className="order-form-inputs">
              <form action="order.php" method="post">
                <input
                  type="text"
                  name="username"
                  placeholder="Vaše jméno"
                  autoComplete="name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Váš e-mail"
                  autoComplete="email"
                  required
                />
                <button className="button violet-button" type="submit">
                  Koupit
                </button>
              </form>
            </div>
          </div>
          <div className="order-block-image">
            <img src="../../public/images/order.png" alt="Sušenky" className="order-image" />
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="rights">Všechna práva nejsou chráněna</div>
      </footer>
    </section>
  );
};

export default OrderPage;
