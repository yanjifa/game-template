import BaseSingleton from "../Base/BaseSingeton";

export default class StorageUtil extends BaseSingleton {
    public async setup() {
        console.log("StorageUtil");
    }
}
