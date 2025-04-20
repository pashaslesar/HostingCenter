import React, { useState } from "react";
import "../../styles.css"; // стили подключены верно

const Home = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Заказ отправлен:\nJméno: ${username}\nEmail: ${email}`);
  };

  return (
    <>
      <section className="order">
        <img src="/images/line.png" alt="čára" className="line" />
        <div className="container">
          <div className="common-title">Objednejte si doménu</div>
          <img src="/images/breadcrumbs.png" alt="navigační drobečky" className="order-bg-image" />
          <div className="order-block">
            <div className="order-form">
              <div className="order-form-text">
                Objednejte si naši zasranou doménu. Pak vám ji ukradneme. Sušenky jako dárek.
              </div>
              <div className="order-form-inputs">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="username"
                    placeholder="Vaše jméno"
                    autoComplete="name"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Váš e-mail"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button className="button violet-button" type="submit">Koupit</button>
                </form>
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
};

export default Home;
