import BaseSingleton from "../base/BaseSingeton";

/**
 * 音频管理器
 *
 * @export
 * @class AudioManager
 */
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
