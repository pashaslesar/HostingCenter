export class HttpService {

    public baseUrl: string = import.meta.env.VITE_API_URL;
    public headers = {
        'Content-Type': 'application/json',  
        "Access-Control-Allow-Origin": "*",
        'Accept': 'application/json'
    };
    
    public defaults: RequestInit = {
        headers: this.headers
    };

    public async fetch(input: RequestInfo, init?: RequestInit): Promise<any> {
        const resp = await fetch(this.baseUrl + input, { ...this.defaults, ...init });
        try{ // if body empty
            return await resp.json();
        } catch { }
    }

    public addDefault(defaults: RequestInit) {
        this.defaults.headers = { ...this.defaults.headers, ...defaults.headers };
    }
}

export default new HttpService();