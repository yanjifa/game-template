import Bluebird = require("bluebird");
import BaseSingleton from "../base/BaseSingeton";
import { ELanguageType, ENotifyType } from "../Enum";
import Game from "../Game";

export default class LocalizedUtil extends BaseSingleton {

    private localizeCfgs: Record<string, string> = {};

    private language: ELanguageType = cc.sys.language as ELanguageType;

    public async setup() {
        this.loadStringConfig();
        console.info("LocalizedUtil setup");
    }

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

    public async changeLanguage(lang: ELanguageType) {
        this.language = lang;
        await this.loadStringConfig();
        Game.NotifyUtil.emit(ENotifyType.LANGUAGE_CHANGED);
    }

    public getLangStr(tid: string): string {
        const [id, ...args] = tid.split(",");
        let str = this.localizeCfgs[id];
        args.forEach((arg, index) => {
            str = str.replace("${p" + (index + 1) + "}", arg);
        });
        return str;
    }
}
