import Bluebird = require("bluebird");
import _ = require("lodash");
import BaseSingleton from "../base/BaseSingeton";

export default class LocalizeUtil extends BaseSingleton {

    private localizeCfgs: { [key: string]: string } = {};

    public async setup() {
        // const lang = cc.sys.language;
        // const lang = cc.sys.LANGUAGE_ENGLISH;
        const lang = cc.sys.LANGUAGE_CHINESE;
        await Bluebird.fromCallback((callback) => {
            cc.resources.load<cc.JsonAsset>(`language/${lang}/StringConfig`, (error, asset) => {
                this.localizeCfgs = asset.json;
                callback(error);
            });
        });
        console.info("LocalizeUtil");
    }

    public get(tid: string) {
        const [id, ...args] = tid.split(",");
        let str = this.localizeCfgs[id];
        args.forEach((arg, index) => {
            str = _.replace(str, "${p" + (index + 1) + "}", arg);
        });
        return str;
    }
}
