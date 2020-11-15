import BaseSingleton from "../base/BaseSingeton";

export default class AudioManager extends BaseSingleton {
    public async setup() {
        console.info("AudioManager setup");
    }

    public playMusic(url: string) {
        //
    }

    public playEffect(url: string) {
        //
    }
}
