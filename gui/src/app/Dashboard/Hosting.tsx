import { useEffect, useState } from "react";
import HostingService from "../../shared/data/hosting/HostingService";

export default function Hosting() {
    
    const [hosting, setHostings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const data = await HostingService.get();
            if(data.domains.length == 0 && data.hostings.length == 0) {
                setLoading(false);
                return;
            }
            const result: any = {};
            for (const key in data) {
                data[key].forEach((obj: any) => {
                  if (!result[obj.domain+"."+obj.tld]) {
                    result[obj.domain+"."+obj.tld] = {};
                  }
                  if (!result[obj.domain+"."+obj.tld][key]) {
                    result[obj.domain+"."+obj.tld][key] = [];
                  }
                  result[obj.domain+"."+obj.tld][key].push(obj);
                });
            }
            setHostings(result);
            setLoading(false);
        })()
    }, []);

    return (
        <div className="flex flex-col">
            <div className="flex w-full justify-between items-center mb-5">
                <div className="text-2xl font-semibold">Hosting</div>    
            </div>
            
            {(loading && hosting == null) && (
                <div className="animate-pulse font-['customsans'] text-blue-800">Loading data...</div>
            )}

            {(!loading && hosting == null) && (
                <div>Nemáte u nás zřízený žádný hosting :/ </div>
            )}

            
            {(!loading && hosting != null) && Object.keys(hosting).map(key => (
                <details key={key} className="open:border-gray-300 duration-200 border-[3px] rounded-md mb-2">
                    <summary className="px-5 py-2 flex cursor-pointer font-['customsans'] text-gray-500 hover:text-gray-800 duration-150 text-lg">{key}</summary>
                    <div className="flex flex-col w-full px-5 pb-4">
                        <div className="flex gap-4">
                            {hosting[key].hostings != undefined && (
                                <div data-status={hosting[key].hostings[0].status} 
                                className="min-h-[8rem] border-[3px] flex flex-col w-1/4 py-2 rounded-lg px-3
                                 data-[status=CREATING]:border-blue-400 data-[status=CREATING]:animate-pulse
                                 data-[status=RUNNING]:border-green-400">
                                    <div className="font-['customsans'] text-lg">Hosting</div>
                                    <div className="w-full ml-1">Status: {hosting[key].hostings[0].status}</div>
                                    <div className="w-full ml-1">Ftp: {hosting[key].hostings[0].domain}{hosting[key].hostings[0].tld} | {hosting[key].hostings[0].ftp}</div>
                                </div>
                            )}
                            {hosting[key].domains != undefined && (
                                <div  data-status={hosting[key].domains[0].status} className="border-[3px] shadow-lg flex flex-col w-1/4 py-2 rounded-lg px-3
                                data-[status=CREATING]:border-blue-400 data-[status=RUNNING]:shadow-blue-300/30 data-[status=CREATING]:animate-pulse
                                data-[status=RUNNING]:border-green-400 data-[status=RUNNING]:shadow-green-300/30">
                                    <div className="font-['customsans'] text-lg">Domain</div>
                                    <div className="w-full ml-1">Status: {hosting[key].domains[0].status}</div>
                                    <div className="w-full ml-1">Addr: <a className="underline hover:no-underline" target="_blank"
                                    href={"http://" + hosting[key].domains[0].domain+"."+hosting[key].domains[0].tld}>
                                        {hosting[key].domains[0].domain}.{hosting[key].domains[0].tld}
                                    </a></div>
                                </div>
                            )}
                            {hosting[key].databases != undefined && (
                                <div data-status={hosting[key].databases[0].status} className="border-[3px] shadow-lg flex flex-col w-1/4 py-2 rounded-lg px-3
                                data-[status=CREATING]:border-blue-400 data-[status=RUNNING]:shadow-blue-300/30 data-[status=CREATING]:animate-pulse
                                data-[status=RUNNING]:border-green-400 data-[status=RUNNING]:shadow-green-300/30">
                                    <div className="font-['customsans'] text-lg">Database</div>
                                    <div className="w-full ml-1">Status: {hosting[key].databases[0].status}</div>
                                    <div className="w-full ml-1">Database: {hosting[key].hostings[0].domain}{hosting[key].hostings[0].tld} | {hosting[key].hostings[0].ftp}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </details>
            ))}
            
        </div>
    );
}