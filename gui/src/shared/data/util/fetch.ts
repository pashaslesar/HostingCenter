// https://stackoverflow.com/questions/45425169/intercept-fetch-api-requests-and-responses-in-javascript
const {fetch: original} = window;
(window as any).fetch = async (input: RequestInfo, init?: RequestInit) => {
    const response = await original(input, init);
    if (!response.ok) {
        throw new Error(await response.json());
    }    
    /* Mock the response here */
    return response;
};
export default original;