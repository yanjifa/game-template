import BaseSingleton from "../base/BaseSingeton";

export default class StorageUtil extends BaseSingleton {
    public async setup() {
        console.info("StorageUtil setup");
    }
}
