import Bluebird = require("bluebird");
import * as _ from "lodash";
import BaseSingleton from "../base/BaseSingeton";
import { ELanguageType, ENotifyType } from "../Enum";
import Game from "../Game";

export default class LocalizeUtil extends BaseSingleton {

    private localizeCfgs: Record<string, string> = {};

    private language: ELanguageType = cc.sys.language as ELanguageType;

    public async setup() {
        this.loadStringConfig();
        console.info("LocalizeUtil setup");
    }

    private async loadStringConfig() {
        await Bluebird.fromCallback((callback) => {
            cc.resources.load<cc.JsonAsset>(`language/${this.language}/StringConfig`, (error, asset) => {
                this.localizeCfgs = asset.json;
                callback(error);
            });
        });
        cc.resources.release(`language/${this.language}/StringConfig`);
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
            str = _.replace(str, "${p" + (index + 1) + "}", arg);
        });
        return str;
    }
}
