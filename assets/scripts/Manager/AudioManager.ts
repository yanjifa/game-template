import BaseSingleton from "../Base/BaseSingeton";

export default class AudioManager extends BaseSingleton {
    public async setup() {
        console.info("AudioManager");
    }
}
