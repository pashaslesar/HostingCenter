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
        { domain: searched + ".org", available: false }
    ]);
}, 1000));

const extractDomain = (str: any) => {
    if (str == "" || str == undefined) return "";
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
};

export default function Domain() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [available, setAvailable] = useState<any>([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const extracted = searchParams.has("domain") ? extractDomain(searchParams.get("domain")) : extractDomain(searchParams.get("search"));
        let domainvalid = false;
        if (searchParams.has("domain")) {
            const domainparts = searchParams.get("domain")?.split(".");
            domainvalid = (domainparts != undefined && domainparts[0] == extracted && domainparts.length == 2);
        }
        if ((searchParams.has("search") && !domainvalid) || !domainvalid) {
            setSearchParams({ ...Object.fromEntries(searchParams), search: extracted });
            setSearch(extracted);
            if (searchParams.has("search") && !searchParams.has("domain")) searchAvailable(extracted);
        }
        if (domainvalid) setSearch(String(searchParams.get("domain")));
    }, []);

    const searchAvailable = async (searched: string) => {
        if (searched == "") return;
        const extracted = extractDomain(searched);
        setLoading(true);
        setSearch(extracted);
        setAvailable(await getAvailable(extracted));
        setLoading(false);
    };

    const register = async (domain: string) => {
        if (!user?.uuid) {
            navigate("/auth/login?domain=" + domain);
            return;
        }
        await HostingService.create(domain, null);
        navigate("/dashboard");
    };

    return (
        <div className="order">
            <div className="container">
                <h1 className="common-title">Zadejte svou budoucí doménu</h1>
                <p className="common-sub-title" style={{ textAlign: "center", marginTop: "20px" }}>
                    Zadejte žádoucí název a vyberte platnou doménu.
                </p>
                <div className="order-form-inputs" style={{ alignItems: "center", marginTop: "40px" }}>
                    <input
                        type="text"
                        placeholder="example"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        disabled={loading}
                    />
                    <button className="button violet-button" onClick={() => searchAvailable(search)} disabled={loading}>
                        {loading ? "Ověřuji..." : "Ověřit dostupnost"}
                    </button>
                </div>

                {!loading && available.length > 0 && (
                    <div style={{ marginTop: "30px" }}>
                        {available.map((offer: any, i: number) => (
                            <div key={i} style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "12px",
                                padding: "16px 32px",
                                backgroundColor: "rgba(255,255,255,0.2)",
                                borderRadius: "16px",
                                backdropFilter: "blur(10px)"
                            }}>
                                <div style={{ fontSize: "20px" }}>{offer.domain}</div>
                                <div>
                                    {offer.available ? (
                                        <button className="button violet-button" onClick={() => register(offer.domain)}>
                                            Koupit
                                        </button>
                                    ) : (
                                        <span style={{ color: "#ff8b8b", fontSize: "16px" }}>Obsazeno</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}