import BaseSingleton from "../base/BaseSingeton";

export default class NotifyUtil extends BaseSingleton {
    public async setup() {
        console.info("NotifyUtil");
    }
}
