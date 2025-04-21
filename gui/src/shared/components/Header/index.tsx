import { NavLink, useNavigate } from "react-router-dom";
import { signOut, useAuth } from "../../store/auth";
import toast from "react-hot-toast/headless";
import { ToastSuccess } from "../Toasts";

// Обновлённый стиль кнопки
const LinkStyle = ({ isActive }: any) =>
  "px-3 py-1 mx-1 rounded-md duration-150 flex items-center cursor-pointer border " +
  (isActive ? "border-white bg-transparent text-white" : "border-transparent hover:border-white hover:bg-white/20");

export default function Header() {
  const user = useAuth((state) => state.user);
  const navigate = useNavigate();

  const logout = () => {
    signOut().then(() => {
      toast("Byli jste odhlášeni", { className: ToastSuccess });
      navigate("/");
    });
  };

  return (
    <header className="w-full flex justify-center bg-[#A095FF]">
      <div className="sm:w-10/12 h-16 flex justify-between items-center text-white">
        {/* Левая часть: přihlášení/odhlášení */}
        <div className="flex items-center">
          {user ? (
            <>
              <NavLink to="/dashboard" className={(isActive) => LinkStyle(isActive)}>
                Administrace
              </NavLink>
              <div onClick={logout} className={LinkStyle(false) + " ml-2"}>
                Odhlásit se
              </div>
            </>
          ) : (
            <NavLink to="/auth/login" className={(isActive) => LinkStyle(isActive)}>
              Přihlásit se
            </NavLink>
          )}
        </div>

        {/* Pravá část: logo a navigace */}
        <div className="flex items-center">
          <nav className="flex">
            <NavLink to="/" className={(isActive) => LinkStyle(isActive)}>
              Domů
            </NavLink>
            <NavLink to="/domain" className={(isActive) => LinkStyle(isActive)}>
              Doména
            </NavLink>
          </nav>
          <span className="mx-4 font-light">|</span>
          <NavLink to="/" className="font-extrabold text-white">
            UPCEHosting
          </NavLink>
        </div>
      </div>
    </header>
  );
}
