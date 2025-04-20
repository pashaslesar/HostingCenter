import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Hosting() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-1">
                <div className="flex-1 flex flex-col justify-between w-1/2 h-full">
                    <div>
                        <h1 className="font-['customsans'] text-gray-700 text-7xl pr-8 whitespace-pre-wrap">
                            {t('page.hosting.header')}
                        </h1>
                        <p className="text-gray-600 mt-4 w-5/6">
                            {t('page.hosting.leading')}
                        </p>
                    </div>
                    <div className="w-3/5">
                        <h4 className="font-['customsans'] text-gray-500 text-2xl pr-8 whitespace-pre-wrap">{t('page.hosting.support-header')}</h4>
                        <p className="text-gray-500">{t('page.hosting.support-leading')}</p>
                        <button className="btn btn-blue mt-2">{t('page.hosting.contact')}</button>
                    </div>
                </div>
                <div className="flex flex-1 w-1/2 h-3/5 px-5">
                    <div className="w-1/3 flex flex-col rounded-md px-3 py-8 border-[3px] items-center justify-between">
                        <div className="flex flex-col items-center">
                            <h3 className="font-['customsans'] text-gray-600 text-xl">{t('page.home.product_web.header')}</h3>
                            <ul className="mt-4 text-lg text-gray-500 font-['customsans']">
                            <li><span className="font-bold text-blue-600 mr-2">✓</span> Linux</li>
                                <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_web.point1')}</li>
                                <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_web.point2')}</li>
                                <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_web.point3')}</li>
                                <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_web.point4')}</li>
                                <li><span className="font-bold text-blue-600 mr-2">✓</span> {t('page.home.product_web.point5')}</li>
                            </ul>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <p className="text-gray-500 text-sm">{t('page.home.from')}</p>
                            <p className="font-['customsans'] text-gray-700 text-3xl mt-1">0Kč</p>
                            <p className="text-gray-500 text-sm">{t('page.home.monthly')}</p> 
                            <Link to="/domain?plan=basic" className="btn btn-blue w-2/3 font-bold">{t('page.home.order')}</Link>
                            <p className="text-gray-500 text-sm">{t('page.home.monthlyVAT')} 0Kč</p> 
                        </div>
                    </div>
                    <div className="w-1/3 flex flex-col rounded-md px-3 py-8 border-[3px] items-center justify-between mx-5 opacity-70">
                        <h3 className="font-['customsans'] text-gray-600 text-xl">Extra hosting</h3>
                        <div className="flex flex-col items-center w-full">
                            <p className="text-gray-500 text-sm">{t('page.home.from')}</p>
                            <p className="font-['customsans'] text-gray-700 text-3xl mt-1">0Kč</p>
                            <p className="text-gray-500 text-sm">{t('page.home.monthly')}</p> 
                            <button disabled className="btn btn-blue w-2/3">{t('page.home.order')}</button>
                            <p className="text-gray-500 text-sm">{t('page.home.monthlyVAT')} 0Kč</p> 
                        </div> 
                    </div>
                    <div className="w-1/3 flex flex-col rounded-md px-3 py-8 border-[3px] items-center justify-between opacity-70">
                        <h3 className="font-['customsans'] text-gray-600 text-xl">Premium hosting</h3>
                        <div className="flex flex-col items-center w-full">
                            <p className="text-gray-500 text-sm">{t('page.home.from')}</p>
                            <p className="font-['customsans'] text-gray-700 text-3xl mt-1">0Kč</p>
                            <p className="text-gray-500 text-sm">{t('page.home.monthly')}</p> 
                            <button disabled className="btn btn-blue w-2/3">{t('page.home.order')}</button>
                            <p className="text-gray-500 text-sm">{t('page.home.monthlyVAT')} 0Kč</p> 
                        </div>
                    </div>
                </div>
        </div>
    );
}