import BaseSingleton from "../Base/BaseSingeton";

export default class GameUtil extends BaseSingleton {
    public async setup() {
        console.log("GameUtil");
    }
}
