import BaseSingleton from "../base/BaseSingeton";
import { ELanguageType, ENotifyType, EStorageKey } from "../Enum";
import Game from "../Game";

export default class LocalizedUtil extends BaseSingleton {

    private localizeCfgs: Record<string, string> = {};

    /**
     * 获取当前语言
     *
     * @readonly
     * @memberof LocalizedUtil
     */
    get language() {
        return this._language;
    }
    private _language: ELanguageType = null;

    public async setup() {
        const defaultLang = ELanguageType[cc.sys.language.toUpperCase()] || ELanguageType.EN;
        this._language = Game.StorageUtil.read(EStorageKey.LANGUAGE, defaultLang) as ELanguageType;
        await this.loadLanguageDir(this._language);
        console.log("LocalizedUtil setup");
    }

    /**
     * 动态加载语言包
     *
     * @private
     * @param lang
     * @memberof LocalizedUtil
     */
    private async loadLanguageDir(lang: string) {
        await Game.AssetManager.loadDir(`language/${lang}`);
        const cfgPath = `language/${lang}/StringConfig`;
        this.localizeCfgs = cc.resources.get<cc.JsonAsset>(cfgPath, cc.JsonAsset).json;
    }

    /**
     * 释放语言包
     *
     * @private
     * @param lang
     * @memberof LocalizedUtil
     */
    private async releaseLanguageDir(lang: string) {
        Game.AssetManager.releaseDir(`language/${lang}`);
    }

    /**
     * 语言改变处理
     *
     * @param lang
     * @memberof LocalizedUtil
     */
    public async changeLanguage(lang: ELanguageType) {
        if (this._language === lang) {
            return;
        }
        const orginLang = this._language;
        this._language = lang;
        Game.NotifyUtil.emit(ENotifyType.BLOCK_INPUT_SHOW, "changeLanguage");
        Game.StorageUtil.write(EStorageKey.LANGUAGE, lang);
        await this.loadLanguageDir(lang);
        Game.NotifyUtil.emit(ENotifyType.LANGUAGE_CHANGED);
        this.releaseLanguageDir(orginLang);
        Game.NotifyUtil.emit(ENotifyType.BLOCK_INPUT_HIDE, "changeLanguage");
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
