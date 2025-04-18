import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Home() {

    const [ domain,setDomain ] = useState<string>("");
    const { t } = useTranslation();
    const anim = [
        `animate-[MoveBackForth_15s_linear_infinite] animation-delay-3000`,
        `animate-[MoveBackForth_35s_linear_infinite] animation-delay-1600`,
        `animate-[MoveBackForth_25s_linear_infinite] animation-delay-100`,
    ];

    return (
        <>
            <div className="flex">
                <div className="w-1/2 flex flex-col p-5">
                    <h1 className="font-['customsans'] text-gray-700 text-7xl whitespace-pre-wrap">
                        {t('page.home.welcome')}
                    </h1>
                    <p className="whitespace-pre text-lg mt-2">{t('page.home.leading')}</p>
                    <div className="mt-5 flex items-center">
                        <input id="domain" type="text" placeholder={t('page.home.check-placeholder')} autoFocus
                        className="peer h-12 px-4 w-full rounded-md border-[3px] border-gray-300 text-gray-900
                        focus:outline-none focus:border-sky-500" value={domain} onChange={e => setDomain(e.target.value)} />
                        <Link to={`/domain?search=${domain}`} className="btn btn-blue h-12 w-full flex-1 px-6 ml-2 font-semibold">{t('page.home.check')}</Link>
                    </div>
                </div>
                <div className="w-1/2 h-full min-h-full flex flex-col flex-1 overflow-hidden">
                    {[0,20,40].map((value, index) => (
                        <div key={index} className={"relative opacity-0 flex flex-row items-center " + anim[index]}
                        style={{top : value + "%"}}>
                            <div className="airplane-line w-16 h-2"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-16 fill-blue-400">
                                {/* Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
                                <path d="M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z"/>
                            </svg>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-1 mt-10">
                <div className="flex-1 justify-between flex flex-col bg-slate-100 rounded-md h-full m-5 p-8 w-1/3">
                    <div>
                        <h2 className="font-['customsans'] text-gray-500 text-4xl">{t('page.home.product_web.header')}</h2>
                        <p className="w-5/6 mt-1 text-gray-600">{t('page.home.product_web.leading')}</p>
                        <ul className="mt-4 ml-3 text-lg text-gray-500 font-['customsans']">
                            <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_web.point1')}</li>
                            <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_web.point2')}</li>
                            <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_web.point3')}</li>
                            <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_web.point4')}</li>
                            <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_web.point5')}</li>
                        </ul>
                    </div>
                    <div className="flex justify-between items-end -mt-4">
                        <div>
                            <p className="text-gray-500 text-sm">{t('page.home.from')}</p>
                            <p className="font-['customsans'] text-gray-700 text-3xl mt-1">0Kč</p>
                            <p className="text-gray-500 text-sm">{t('page.home.monthly')}</p> 
                        </div>
                        <Link to="/hosting" className="btn bg-blue-500 hover:bg-blue-300 text-white min-w-46 font-bold text-lg">
                            {t('page.home.more')}
                        </Link>
                    </div>
                </div>
                <div className="flex-1 justify-between flex flex-col bg-slate-100 rounded-md h-full m-5 p-8 w-1/3 opacity-80">
                    <div>
                        <h2 className="font-['customsans'] text-gray-500 text-4xl">{t('page.home.product_mail.header')}</h2>
                        <p className="w-5/6 mt-1 text-gray-600">{t('page.home.product_mail.leading')}</p>
                        <ul className="mt-4 ml-3 text-lg text-gray-500 font-['customsans']">
                            <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_mail.point1')}</li>
                            <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_mail.point2')}</li>
                            <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_mail.point3')}</li>
                            <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_mail.point4')}</li>
                            <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_mail.point5')}</li>
                        </ul>
                    </div>
                    <div className="flex justify-between items-end -mt-4">
                        <div>
                            <p className="text-gray-500 text-sm">{t('page.home.from')}</p>
                            <p className="font-['customsans'] text-gray-700 text-3xl mt-1">0Kč</p>
                            <p className="text-gray-500 text-sm">{t('page.home.monthly')}</p> 
                        </div>
                        <button disabled className="btn bg-blue-400 hover:bg-blue-300 text-white min-w-46 font-bold text-lg">
                            {t('page.home.more')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}