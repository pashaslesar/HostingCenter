import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../shared/store/auth";
import HostingService from "../../shared/data/hosting/HostingService";

const getAvailable = async (searched: string) => await new Promise(resolve => setTimeout(() => {
    resolve([
        { domain: searched + ".cz", available: true },
        { domain: searched + ".com", available: true },
        { domain: searched + ".sk", available: false },
        { domain: searched + ".net", available: true },
        { domain: searched + ".org", available: true }
    ]);
}, 1000));


const extractDomain = (str: any) => {
    if(str == "" || str == undefined) return "";
    let validChars = "";
    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        if (/^[a-zA-Z0-9\-_]+$/.test(char)) {
            validChars += char;
        } else {
            break;
        }
    }
    return validChars;
}


export default function Domain() {

    const {t} = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [available, setAvailable] = useState<any>([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const extracted = searchParams.has("domain") ? extractDomain(searchParams.get("domain")) : extractDomain(searchParams.get("search"));
        let domainvalid = false;
        if(searchParams.has("domain")) {
            const domainparts = searchParams.get("domain")?.split(".");
            domainvalid = (domainparts != undefined && domainparts[0] == extracted && domainparts.length == 2 );
        }
        if(searchParams.has("search") && !domainvalid || !domainvalid) {
            setSearchParams({...Object.fromEntries(searchParams), search: extracted })
            setSearch(extracted);
            if(searchParams.has("search") && !searchParams.has("domain")) searchAvailable(extracted);
        }
        if(domainvalid) setSearch(String(searchParams.get("domain")));

    }, []);

    const searchAvailable = async (searched: string) => {
        if(searched == "") return;
        const extracted = extractDomain(searched);
        setLoading(true);
        setSearch(extracted)
        setAvailable(await getAvailable(extracted));
        setLoading(false);

    };

    const register = async (domain: string) => {
        searchParams.set("domain", domain);
        setSearchParams({...Object.fromEntries(searchParams)})
        setSearch(domain);
    }

    const removeRegistered = async () => {
        searchParams.delete("domain");
        setSearchParams({...Object.fromEntries(searchParams) })
    }

    const choosePlan = async (plan: string) => {
        searchParams.set("plan", plan);
        setSearchParams({...Object.fromEntries(searchParams) })
    }

    const removePlan = async () => {
        searchParams.delete("plan");
        setSearchParams({...Object.fromEntries(searchParams) })
    }

    const createHosting = async () => {
        setLoading(true);
        await HostingService.create(searchParams.get("domain"), searchParams.get("plan"));
        setSearchParams({});
        navigate("/dashboard")
        setLoading(false);
    }

    return (
        <div className="flex-col flex items-center">
            <div className="w-5/6 flex flex-col items-center p-5">
                {(searchParams.has("plan") && !searchParams.has("domain")) && (<h1 className="font-['customsans'] text-gray-700 text-6xl whitespace-pre-wrap">Máte vybraný hosting. Teď už stačí jen doména!</h1>)} 
                {(!searchParams.has("plan") && !searchParams.has("domain")) && (<h1 className="font-['customsans'] text-gray-700 text-6xl whitespace-pre-wrap">Dobrá doména vás vás odliší od ostatních!</h1>)}
                {(!searchParams.has("plan") && searchParams.has("domain")) && (<h1 className="font-['customsans'] text-gray-700 text-6xl whitespace-pre-wrap">Už chybí jen vybrat hostingový plán!</h1>)}
                {(searchParams.has("plan") && searchParams.has("domain")) && (<h1 className="font-['customsans'] text-gray-700 text-6xl whitespace-pre-wrap">Rozjedová dráha je připravena na váš vzlet!</h1>)}

                <p className="whitespace-pre text-lg mt-2 text-center text-gray-600">Doména je vaše online adresa. Je to místo, kde vás lidé mohou najít na internetu a kde si můžete vybudovat svou digitální přítomnost.<br/>Vyberte si svůj dokonalý název domény ještě dnes!</p>
                <div className="mt-10 flex items-center w-full">
                    <input id="domain" type="text" autoFocus placeholder="Název vaší nové domény" disabled={searchParams.has("domain")} 
                    className={`peer h-12 px-4 w-full rounded-md border-[3px] border-gray-300 text-gray-900 duration-150 ${searchParams.has("domain") && "bg-blue-100 border-blue-400"}
                    focus:outline-none focus:border-sky-500`} value={search} onChange={e => setSearch(e.target.value)}/>
                    <button onClick={() => (!searchParams.has("domain")) ? searchAvailable(search) : removeRegistered()} className="btn btn-blue h-12 px-6 ml-2 w-2/12 font-semibold">
                        {(!searchParams.has("domain")) ? "Ověřit dostupnost" : "Zrušit"}
                    </button>
                </div>
            </div>
                
            <div className="flex flex-col w-5/6 mx-10 mt-3">
                {!searchParams.has("domain") && loading && (
                    <div className="w-full flex justify-center animate-pulse font-['customsans'] text-blue-800">
                        Ověřuji dostupnost domény...
                    </div>
                )}
                {!searchParams.has("domain") && !loading && available.length > 0 && available.map((offer: any, index: number) => (
                    <div key={index} className="border-[3px] flex justify-between mx-5 rounded-md items-center p-1 mt-2">
                        <div className="pl-5 flex">
                        <p className="text-gray-700 font-medium">{offer.domain}</p>
                            <div className={ `${(offer.available ? "bg-green-300" : "bg-red-300")} rounded-xl px-4 ml-4`}>
                                { offer.available ? "volná" : "obsazeno" }
                            </div>
                        </div>
                        <div className="flex items-center">
                            {offer.available && (
                                <div className="text-gray-600 text-lg font-medium mr-5">0 kč</div>
                            )}
                            <button onClick={() => register(offer.domain)} disabled={offer.available ? false : true} className="btn btn-blue">
                                Zaregistrovat
                            </button>
                        </div>
                    </div>
                ))}
                {searchParams.has("domain") && (
                    <div className="flex flex-1 w-full h-3/5 px-5">
                        <div className={`w-1/3 flex flex-col rounded-md px-3 py-8 border-[3px] items-center justify-between duration-150
                        ${((searchParams.get("plan") == "basic") && "bg-blue-100 border-blue-400")}`}>
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
                                {(searchParams.get("plan") == "basic") ? (
                                    <button onClick={() => removePlan()} className="btn btn-blue w-2/3 font-bold">Zrušit</button>
                                ) : (
                                    <button onClick={() => choosePlan("basic")} className="btn btn-blue w-2/3 font-bold">Vybrat</button>
                                )}
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
                )}
                {searchParams.has("domain") && searchParams.has("plan") && !loading && (
                    (user?.uuid == null) ? (
                        <Link to={"/auth/login?" + searchParams.toString()} className="btn btn-blue w-1/2 self-center mt-8 h-12 font-['customsans'] text-xl">
                            Přihlásit se a vytvořit hosting!
                        </Link>
                    ) : (
                        <button onClick={() => createHosting()} className="btn btn-blue w-1/2 self-center mt-8 h-12 font-['customsans'] text-xl">
                            Vytvořit hosting!
                        </button>
                    )
                )}
                {searchParams.has("domain") && searchParams.has("plan") && loading && (
                    <div className="w-full flex justify-center animate-pulse font-['customsans'] text-blue-800 mt-8">
                        Zřizuji požadavek...
                    </div>
                )}
            </div>
        </div>
    );
}