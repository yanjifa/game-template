import Bluebird = require("bluebird");
import BaseSingleton from "../base/BaseSingeton";

/**
 * 资源管理器, 加载目录支持引用计数, 注意不可父子目录混用
 *
 * @export
 * @class AssetManager
 */
export default class AssetManager extends BaseSingleton {

    private loadedResDirMap: Map<string, number> = new Map();

    public async setup() {
        console.log("AssetManager setup");
    }

    /**
     * 加载资源, 目录数组
     *
     * @param paths
     * @param [progressCallback]
     * @returns {*}
     * @memberof AssetManager
     */
    public async loadDirs(paths: string[], progressCallback?: (percent: number) => void): Promise<void> {
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

    /**
     * 加载单个目录
     *
     * @param path
     * @param [progressCallback]
     * @returns {*}
     * @memberof AssetManager
     */
    public async loadDir(path: string, progressCallback?: (percent: number) => void): Promise<void> {
        let refNum = this.loadedResDirMap.get(path) || 0;
        if (refNum > 0) {
            this.loadedResDirMap.set(path, ++refNum);
            console.log(`AssetManager already loaded: ${path}`);
            return;
        }
        this.loadedResDirMap.set(path, ++refNum);
        await Bluebird.fromCallback((callback) => {
            cc.resources.loadDir(path, (finish, total, item) => {
                progressCallback && progressCallback(finish / total);
            }, callback);
        });
        console.log(`AssetManager loadDir: ${path}`);
    }

    /**
     * 释放目录数组
     *
     * @param paths
     * @memberof AssetManager
     */
    public releaseDirs(paths: string[]) {
        paths.forEach((path) => this.releaseDir(path));
    }

    /**
     * 释放单个目录
     *
     * @param path
     * @returns {*}
     * @memberof AssetManager
     */
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
        console.log(`AssetManager releaseDir: ${path}`);
    }

    /**
     * 目录是否已加载, 判断引用计数是否大于 0
     *
     * @param path
     * @returns {*}
     * @memberof AssetManager
     */
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
