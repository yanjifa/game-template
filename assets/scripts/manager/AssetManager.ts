import Bluebird = require("bluebird");
import BaseSingleton from "../base/BaseSingeton";

export default class AssetManager extends BaseSingleton {

    private loadedResDirMap: Map<string, number> = new Map();

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
        let refNum = this.loadedResDirMap.get(path) || 0;
        if (refNum > 0) {
            this.loadedResDirMap.set(path, ++refNum);
            console.info(`AssetManager already loaded: ${path}`);
            return;
        }
        this.loadedResDirMap.set(path, ++refNum);
        await Bluebird.fromCallback((callback) => {
            cc.resources.loadDir(path, (finish, total, item) => {
                progressCallback && progressCallback(finish / total);
            }, callback);
        });
        console.info(`AssetManager loadDir: ${path}`);
    }

    public releaseDirs(paths: string[]) {
        paths.forEach((path) => this.releaseDir(path));
    }

    public releaseDir(path: string) {
        let refNum = this.loadedResDirMap.get(path);
        if (refNum === null && refNum === undefined) {
            return;
        }
        this.loadedResDirMap.set(path, --refNum);
        if (refNum > 0) {
            return;
        }
        cc.resources.release(path);
        console.info(`AssetManager releaseDir: ${path}`);
    }

    public isDirLoaded(path: string) {
        return this.loadedResDirMap.get(path) > 0;
    }

    public dumpDirMap() {
        const data = [];
        this.loadedResDirMap.forEach((v, k) => {
            v !== 0 && data.push({ dir: k, refNum: v });
        });
        console.table(data);
    }
}
