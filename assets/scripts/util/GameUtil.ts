import BaseSingleton from "../base/BaseSingeton";

export default class GameUtil extends BaseSingleton {
    public async setup() {
        console.info("GameUtil setup");
    }
}
