import { useForm } from "react-hook-form";
import toast from "react-hot-toast/headless";
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom";
import { ToastDanger, ToastSuccess } from "../../shared/components/Toasts";
import BaseHttpService from "../../shared/data/util/BaseHttpService";

export default function Recovery() {

    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const recovery = (data: any) => {
        BaseHttpService.fetch('/auth/recover', { method: 'POST', body: JSON.stringify(data) }).then(async (resp) => {
            toast(t('page.recovery.success'), { className: ToastSuccess });
            navigate('/auth/login');
        }).catch(e => {
            console.log("error", e.message);
            toast(t('page.recovery.error.' + e.message), { className: ToastDanger });
        });
    }

    return (
        <form onSubmit={handleSubmit(recovery)} className="flex flex-col items-center bg-slate-100 w-full lg:w-3/5 xl:w-2/5 p-10 rounded-md">     
            <div className="mb-5 text-xl text-slate-500 font-bold">{t('page.recovery.header')}</div>

            <div className="relative w-full my-3">
                <input id="email" type="text" placeholder={t('page.recovery.email')}
                className="peer h-12 px-4 w-full rounded-md border-2 border-gray-300 text-gray-900 placeholder-transparent
                focus:outline-none focus:border-sky-500" {...register("email", { required: true })} />
                <label htmlFor="email" className="absolute px-1 bg-white left-4 -top-2 text-gray-600 text-sm transition-all
                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5
                peer-focus:-top-2 peer-focus:text-sky-500 peer-focus:text-sm">
                    {t('page.recovery.email')}
                </label>
                {errors.email && (
                    <span className="text-xs text-red-500">This field is required</span>
                )}
            </div>


            <div className="text-sm text-center text-slate-500">
                {t('page.recovery.info')}
            </div>

            <button type="submit"
            className="px-4 mt-3 py-2 w-full rounded-md duration-150 cursor-pointer bg-blue-500 hover:bg-blue-300 text-white">
                {t('page.recovery.submit')}
            </button>
        </form>
    )
}
