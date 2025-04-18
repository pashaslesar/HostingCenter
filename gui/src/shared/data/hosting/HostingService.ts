import BaseHttpService, { HttpService } from "../util/BaseHttpService";

export default new class HostingService {
    
    protected http: HttpService;
    
    constructor () {
        this.http = BaseHttpService;
    }

    public async get(): Promise<any | null> {
        return await BaseHttpService.fetch('/hosting');
    }

    public async create(domain: string | null, plan: string | null): Promise<any | null> {
        const data = JSON.stringify({"domain": domain,
            "plan": plan
        });
        return await BaseHttpService.fetch('/hosting', { method: 'POST', body: data });
    }

}