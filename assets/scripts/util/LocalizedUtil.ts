import Bluebird = require("bluebird");
import BaseSingleton from "../base/BaseSingeton";
import { ELanguageType, ENotifyType, EStorageKey } from "../Enum";
import Game from "../Game";

export default class LocalizedUtil extends BaseSingleton {

    private localizeCfgs: Record<string, string> = {};

    private language: ELanguageType = null;

    public async setup() {
        this.language = Game.StorageUtil.read(EStorageKey.LANGUAGE, cc.sys.language) as ELanguageType;
        this.loadStringConfig();
        console.info("LocalizedUtil setup");
    }

    /**
     * 动态加载多语言配置
     *
     * @private
     * @memberof LocalizedUtil
     */
    private async loadStringConfig() {
        const cfgPath = `language/${this.language}/StringConfig`;
        await Bluebird.fromCallback((callback) => {
            cc.resources.load<cc.JsonAsset>(cfgPath, (error, asset) => {
                this.localizeCfgs = asset.json;
                callback(error);
            });
        });
        cc.resources.release(cfgPath);
    }

    /**
     * 语言改变处理
     *
     * @param lang
     * @memberof LocalizedUtil
     */
    public async changeLanguage(lang: ELanguageType) {
        if (this.language === lang) {
            return;
        }
        this.language = lang;
        Game.StorageUtil.write(EStorageKey.LANGUAGE, this.language);
        await this.loadStringConfig();
        Game.NotifyUtil.emit(ENotifyType.LANGUAGE_CHANGED);
    }

    /**
     * 获得 tid 对应的字符串配置
     *
     * @param tid
     * @returns string
     * @memberof LocalizedUtil
     */
    public getLangStr(tid: string): string {
        const [id, ...args] = tid.split(",");
        let str = this.localizeCfgs[id];
        args.forEach((arg, index) => {
            str = str.replace("${p" + (index + 1) + "}", arg);
        });
        return str;
    }
}
