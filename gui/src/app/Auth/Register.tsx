import { useForm } from "react-hook-form";
import toast from "react-hot-toast/headless";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { ToastDanger, ToastSuccess } from "../../shared/components/Toasts";
import BaseHttpService from "../../shared/data/util/BaseHttpService";

export default function Register() {

    const { t } = useTranslation();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [ searchParams ] = useSearchParams();
    const navigate = useNavigate();

    const confirmation = async (value: string) => {
        if (watch('password') != value) return "Your passwords do no match";
    }

    const create = (data: any) => {
        // delete data['confirmation'];
        const stringdata = JSON.stringify(data);
        BaseHttpService.fetch('/users', { method: 'POST', body: stringdata }).then(async (resp) => {
            toast(t('page.register.success'), { className: ToastSuccess });
            navigate("/auth/login?" + searchParams.toString());
        }).catch(e => {
            console.log(e);
            toast(t('page.register.error.' + e.message), { className: ToastDanger });
        });
    };

    return (
        <form onSubmit={handleSubmit(create)} className="flex flex-col items-center bg-slate-100 w-full lg:w-3/5 xl:w-2/5 p-10 rounded-md">
                 
            <div className="mb-5 text-xl text-slate-500 font-bold">{t('page.register.header')}</div>

            <div className="flex flex-col xl:flex-row w-full">
                <div className="relative w-full my-3 lg:pr-2">
                    <input id="first_name" type="text" placeholder={t('page.register.first_name')}
                    className="peer h-12 px-4 w-full rounded-md border-2 border-gray-300 text-gray-900 placeholder-transparent
                    focus:outline-none focus:border-sky-500" {...register("first_name", { required: true })} />
                    <label htmlFor="first_name" className="absolute px-1 bg-white left-4 -top-2 text-gray-600 text-sm transition-all
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5
                    peer-focus:-top-2 peer-focus:text-sky-500 peer-focus:text-sm">
                        {t('page.register.first_name')}
                    </label>
                    {errors.first_name && (
                        <span className="text-xs text-red-500">This field is required</span>
                    )}
                </div>

                <div className="relative w-full my-3 lg:pl-2">
                    <input id="last_name" type="text" placeholder={t('page.register.last_name')}
                    className="peer h-12 px-4 w-full rounded-md border-2 border-gray-300 text-gray-900 placeholder-transparent
                    focus:outline-none focus:border-sky-500" {...register("last_name", { required: true })} />
                    <label htmlFor="first_name" className="absolute px-1 bg-white left-4 -top-2 text-gray-600 text-sm transition-all
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5
                    peer-focus:-top-2 peer-focus:text-sky-500 peer-focus:text-sm">
                        {t('page.register.last_name')}
                    </label>
                    {errors.first_name && (
                        <span className="text-xs text-red-500">This field is required</span>
                    )}
                </div>
            </div>


            <div className="relative w-full my-3">
                <input id="display" type="text" placeholder={t('page.register.display')}
                className="peer h-12 px-4 w-full rounded-md border-2 border-gray-300 text-gray-900 placeholder-transparent
                focus:outline-none focus:border-sky-500" {...register("display", { required: true})} />
                <label htmlFor="display" className="absolute px-1 bg-white left-4 -top-2 text-gray-600 text-sm transition-all
                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5
                peer-focus:-top-2 peer-focus:text-sky-500 peer-focus:text-sm">
                    {t('page.register.display')}
                </label>
                {errors.display && (
                    <span className="text-xs text-red-500">This field is required</span>
                )}
            </div>

            <div className="relative w-full my-3">
                <input id="email" type="text" placeholder={t('page.register.email')}
                className="peer h-12 px-4 w-full rounded-md border-2 border-gray-300 text-gray-900 placeholder-transparent
                focus:outline-none focus:border-sky-500" {...register("email", { required: true })} />
                <label htmlFor="email" className="absolute px-1 bg-white left-4 -top-2 text-gray-600 text-sm transition-all
                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5
                peer-focus:-top-2 peer-focus:text-sky-500 peer-focus:text-sm">
                    {t('page.register.email')}
                </label>
                {errors.email && (
                    <span className="text-xs text-red-500">This field is required</span>
                )}
            </div>

            <div className="relative w-full my-3">
                <input id="phone" type="text" placeholder={t('page.register.phone')}
                className="peer h-12 px-4 w-full rounded-md border-2 border-gray-300 text-gray-900 placeholder-transparent
                focus:outline-none focus:border-sky-500" {...register("phone")} />
                <label htmlFor="phone" className="absolute px-1 bg-white left-4 -top-2 text-gray-600 text-sm transition-all
                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5
                peer-focus:-top-2 peer-focus:text-sky-500 peer-focus:text-sm">
                    {t('page.register.phone')}
                </label>
            </div>

            
            <div className="flex flex-col xl:flex-row w-full">
                <div className="relative w-full my-3 lg:pr-2">
                    <input id="password" type="password" placeholder={t('page.register.password')}
                    className="peer h-12 px-4 w-full rounded-md border-2 border-gray-300 text-gray-900 placeholder-transparent
                    focus:outline-none focus:border-sky-500"  {...register("password", { required: true })} />
                    <label htmlFor="password" className="absolute px-1 bg-white left-4 -top-2 text-gray-600 text-sm transition-all
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5
                    peer-focus:-top-2 peer-focus:text-sky-500 peer-focus:text-sm">
                        {t('page.register.password')}
                    </label>
                    {errors.password && (
                        <span className="text-xs text-red-500">This field is required</span>
                    )}
                </div>

                <div className="relative w-full my-3 lg:pl-2">
                    <input id="confirmation" type="password" placeholder={t('page.register.confirmation')}
                    className="peer h-12 px-4 w-full rounded-md border-2 border-gray-300 text-gray-900 placeholder-transparent
                    focus:outline-none focus:border-sky-500"  {...register("confirmation", { required: true, validate: { confirmation: confirmation } })} />
                    <label htmlFor="confirmation" className="absolute px-1 bg-white left-4 -top-2 text-gray-600 text-sm transition-all
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5
                    peer-focus:-top-2 peer-focus:text-sky-500 peer-focus:text-sm">
                        {t('page.register.confirmation')}
                    </label>
                    {errors.confirmation && (<>
                        {errors.confirmation.type == "required" && (
                            <span className="text-xs text-red-500">This field is required</span>
                        )}
                        {errors.confirmation.type == "confirmation" && (
                            <span className="text-xs text-red-500">Passwords have to match</span>
                        )}
                    </>)}
                </div>
            </div>



            <button type="submit"
            className="px-4 mt-3 py-2 w-full rounded-md duration-150 cursor-pointer bg-blue-500 hover:bg-blue-300 text-white">
                {t('page.register.submit')}
            </button>

            <div className="mt-3 flex w-full text-slate-500">
                <NavLink className="underline hover:no-underline cursor-pointer hover:text-slate-700 duration-150" to={"/auth/login?" + searchParams.toString()}>
                    {t('page.register.back')}
                </NavLink>
            </div>
        </form>
    );

}