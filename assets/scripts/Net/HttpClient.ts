import "whatwg-fetch";
import BaseSingleton from "../base/BaseSingeton";

export default class HttpClient extends BaseSingleton {
    public async setup() {
        console.log("HttpClient setup");
    }

    public async get(url: string, params?: Record<string, unknown>) {
        try {
            if (params) {
                const paramsArr = [];
                Object.keys(params).map((key) => paramsArr.push(`${key}=${params[key]}`));
                (url.search(/\?/) === -1) ? url += "?" : url += "&";
                url += paramsArr.join("&");
            }
            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                },
            });
        } catch (e) {
            console.error(e);
        }
    }

    public async post(url: string, boday: Record<string, unknown>) {
        try {
            return await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(boday),
            });
        } catch (e) {
            console.error(e);
        }
    }
}
