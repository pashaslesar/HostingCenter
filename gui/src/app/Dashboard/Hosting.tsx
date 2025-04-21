import { useEffect, useState } from "react";
import HostingService from "../../shared/data/hosting/HostingService";
import "../../styles.css";

export default function Hosting() {
    const [hosting, setHostings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const data = await HostingService.get();
            if (data.domains.length == 0 && data.hostings.length == 0) {
                setLoading(false);
                return;
            }
            const result: any = {};
            for (const key in data) {
                data[key].forEach((obj: any) => {
                    if (!result[obj.domain + "." + obj.tld]) {
                        result[obj.domain + "." + obj.tld] = {};
                    }
                    if (!result[obj.domain + "." + obj.tld][key]) {
                        result[obj.domain + "." + obj.tld][key] = [];
                    }
                    result[obj.domain + "." + obj.tld][key].push(obj);
                });
            }
            setHostings(result);
            setLoading(false);
        })();
    }, []);

    return (
        <div className="container" style={{ paddingTop: "25px", paddingBottom: "25px", position: "relative" }}>
            <h1 className="common-title">Hosting</h1>

            {(loading && hosting == null) && (
                <div style={{ color: "#9cbefb", fontSize: "18px", marginTop: "40px" }}>Loading data...</div>
            )}

            {(!loading && hosting == null) && (
                <div style={{ fontSize: "20px", marginTop: "40px" }}>Nemáte u nás zřízený žádný hosting!</div>
            )}

            {(!loading && hosting != null) && Object.keys(hosting).map(key => (
                <details key={key} className="order-block" style={{ marginBottom: "40px", borderRadius: "20px", flexDirection: "column" }}>
                    <summary style={{
                        fontSize: "28px",
                        color: "white",
                        fontWeight: "bold",
                        padding: "20px 40px",
                        cursor: "pointer",
                        listStyle: "none"
                    }}>{key}</summary>

                    <div style={{ display: "flex", gap: "40px", padding: "20px 40px", flexWrap: "wrap" }}>
                        {hosting[key].hostings != undefined && (
                            <div data-status={hosting[key].hostings[0].status} style={cardStyle}>
                                <div style={cardTitle}>Hosting</div>
                                <div>Status: {hosting[key].hostings[0].status}</div>
                                <div>Ftp: {hosting[key].hostings[0].domain}{hosting[key].hostings[0].tld} | {hosting[key].hostings[0].ftp}</div>
                            </div>
                        )}
                        {hosting[key].domains != undefined && (
                            <div data-status={hosting[key].domains[0].status} style={cardStyle}>
                                <div style={cardTitle}>Domain</div>
                                <div>Status: {hosting[key].domains[0].status}</div>
                                <div>
                                    Addr: <a style={{ color: "white", textDecoration: "underline" }} target="_blank"
                                        href={"http://" + hosting[key].domains[0].domain + "." + hosting[key].domains[0].tld}>
                                        {hosting[key].domains[0].domain}.{hosting[key].domains[0].tld}
                                    </a>
                                </div>
                            </div>
                        )}
                        {hosting[key].databases != undefined && (
                            <div data-status={hosting[key].databases[0].status} style={cardStyle}>
                                <div style={cardTitle}>Database</div>
                                <div>Status: {hosting[key].databases[0].status}</div>
                                <div>Database: {hosting[key].databases[0].domain}{hosting[key].databases[0].tld} | {hosting[key].databases[0].db}</div>
                            </div>
                        )}
                    </div>
                </details>
            ))}

            {/* Фоновая линия */}
            <img
                src="/images/line.png"
                alt="background-line"
                className="line"
            />
        </div>
    );
}

const cardStyle: React.CSSProperties = {
    padding: "24px",
    borderRadius: "16px",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
    color: "white",
    minWidth: "220px",
    flex: "1",
    fontSize: "18px",
    boxSizing: "border-box",
};

const cardTitle: React.CSSProperties = {
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "12px"
};
