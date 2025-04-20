import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { signOut, useAuth } from "../../store/auth";
import toast from "react-hot-toast/headless";
import { useRef } from "react";
import { ToastSuccess } from "../Toasts";

const LinkStyle = ({isActive}: any) => "px-3 py-1 mx-1 rounded-md duration-150 flex items-center cursor-pointer " + (isActive ? "bg-slate-300" : "hover:bg-slate-400");

export default function Header() {

	const { t, i18n } = useTranslation();
	const refChangeLanguage = useRef<HTMLDetailsElement>(null);
	const user = useAuth(state => state.user);
	const navigate = useNavigate();

	const changeLanguage = (lang: any) => {
		refChangeLanguage?.current?.removeAttribute("open");
		window.localStorage.setItem('locale', lang);
		i18n.changeLanguage(lang);
	};

	const logout = () => {
		signOut().then(() => {
			toast(t('general.signout'), { className: ToastSuccess });
			navigate("/");
		})
	}

	return (
		<header className="w-full flex justify-center bg-slate-200">
			<div className="sm:w-10/12 h-16 flex justify-between items-center text-gray-500">
				<div className="flex items-center">
					<NavLink to="/" className="font-extrabold text-blue-500">ExampleHosting</NavLink>
					<span className="mx-4 font-light bg-transparent">|</span>
					<nav className="flex"> {/* flex-col fixed bg-gray-400 top-0 left-0 w-1/2 h-full z-50 */}
						<NavLink to="/" className={(isActive) => LinkStyle(isActive)}>{t('menu.home')}</NavLink>
						<NavLink to="/hosting" className={(isActive) => LinkStyle(isActive)}>{t('menu.hosting')}</NavLink>
						<NavLink to="/domain" className={(isActive) => LinkStyle(isActive)}>{t('menu.domain')}</NavLink>
						<NavLink to="/unavailable" className={(isActive) => LinkStyle(isActive)}>{t('menu.contact')}</NavLink>
					</nav>
				</div>
				<div className="flex items-center">
					{ user ? (
						<>
						<NavLink to="/dashboard" className={(isActive) => LinkStyle(isActive)}>{t('menu.dashboard')}</NavLink>
						<div onClick={logout} className={LinkStyle(false) + " ml-5"}>{t('menu.logout')}</div>
						</>
					) : (
						<NavLink to="/auth/login" className={(isActive) => LinkStyle(isActive)}>{t('menu.login')}</NavLink>
					)}
					
					<div className="flex">
						<details ref={refChangeLanguage}>
							<summary className={LinkStyle(false) + " list-item"}>
								{i18n.resolvedLanguage}
							</summary>
							<div className="absolute bg-gray-50 border rounded-md mt-2 flex flex-col">
								{i18n.languages.map((m) => (
									<button type="button" key={m} onClick={() => changeLanguage(m)} 
									className="px-4 py-2 hover:bg-gray-200 duration-150 cursor-pointer border-b last:border-b-0">
										{m}
									</button>
								))}
							</div>
						</details>
					</div>

				</div>
			</div>
		</header>
	);
}
