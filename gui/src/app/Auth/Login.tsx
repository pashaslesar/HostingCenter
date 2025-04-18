import toast from "react-hot-toast/headless";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { LoginData, signIn } from "../../shared/store/auth";
import { ToastDanger, ToastSuccess } from "../../shared/components/Toasts";


export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();
    const [ searchParams ] = useSearchParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const login = (data: LoginData) => {
        signIn(data).then(() => {
            toast(t('general.signin'), { className: ToastSuccess });
            if(searchParams.has("domain") && searchParams.has("plan")) {
                navigate("/domain?" + searchParams.toString())
            } else {
                navigate("/dashboard?" + searchParams.toString());
            }
        }).catch(e => {
            toast(t('page.login.error.' + e.message), { className: ToastDanger });
        });
    };

    return (
        <form onSubmit={handleSubmit(login)} className="flex flex-col items-center bg-slate-100 w-full lg:w-3/5 xl:w-2/5 p-10 rounded-md">
                
            <div className="mb-5 text-xl text-slate-500 font-bold">{t('page.login.header')}</div>

            <div className="relative w-full my-3">
                <input id="email" type="text" placeholder={t('page.login.email')}
                className="peer h-12 px-4 w-full rounded-md border-2 border-gray-300 text-gray-900 placeholder-transparent
                focus:outline-none focus:border-sky-500" {...register("email", { required: true })} />
                <label htmlFor="email" className="absolute px-1 bg-white left-4 -top-2 text-gray-600 text-sm transition-all
                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5
                peer-focus:-top-2 peer-focus:text-sky-500 peer-focus:text-sm">
                    {t('page.login.email')}
                </label>
                {errors.email && (
                    <span className="text-xs text-red-500">This field is required</span>
                )}
            </div>

            <div className="relative w-full my-3">
                <input id="password" type="password" placeholder="Password"
                className="peer h-12 px-4 w-full rounded-md border-2 border-gray-300 text-gray-900 placeholder-transparent
                focus:outline-none focus:border-sky-500"  {...register("password", { required: true })} />
                <label htmlFor="password" className="absolute px-1 bg-white left-4 -top-2 text-gray-600 text-sm transition-all
                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5
                peer-focus:-top-2 peer-focus:text-sky-500 peer-focus:text-sm">
                    {t('page.login.password')}
                </label>
                {errors.password && (
                    <span className="text-xs text-red-500">This field is required</span>
                )}
            </div>

            <button type="submit"
            className="px-4 mt-3 py-2 w-full rounded-md duration-150 cursor-pointer bg-blue-500 hover:bg-blue-300 text-white">
                {t('page.login.submit')}
            </button>

            <div className="w-full mt-3 flex justify-between items-center text-slate-500">   
                <NavLink to={"/auth/register?" + searchParams.toString()} className="underline hover:no-underline cursor-pointer hover:text-slate-700 duration-150">
                    {t('page.login.create')}
                </NavLink>
                <NavLink to={"/auth/recovery?" + searchParams.toString()} className="underline hover:no-underline cursor-pointer hover:text-slate-700 duration-150">
                    {t('page.login.recovery')}
                </NavLink>
            </div>

        </form>
    );
}