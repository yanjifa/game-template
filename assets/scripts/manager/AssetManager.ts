import Bluebird = require("bluebird");
import BaseSingleton from "../base/BaseSingeton";

export default class AssetManager extends BaseSingleton {
    public async setup() {
        console.info("AssetManager setup");
    }

    public async loadDirs(paths: string[], progressCallback?: (percent: number) => void) {
        if (!paths || paths.length <= 0) {
            return;
        }
        await Bluebird.each(paths, (path, index, pathLen) => {
            return this.loadDir(path, (percent) => {
                percent = percent / pathLen + index / pathLen;
                progressCallback && progressCallback(percent);
            });
        });
    }

    public async loadDir(path: string, progressCallback?: (percent: number) => void) {
        await Bluebird.fromCallback((callback) => {
            cc.resources.loadDir(path, (finish, total, item) => {
                progressCallback && progressCallback(finish / total);
            }, callback);
        });
    }

    public releaseDirs(paths: string[]) {
        paths.forEach((path) => this.releaseDir(path));
    }

    public releaseDir(path: string) {
        cc.resources.release(path);
    }
}
