import BaseSingleton from "../base/BaseSingeton";
import { EStorageKey } from "../Enum";

const STORAGE_PREFIX = "GAME";

/**
 * 客户端存档工具
 *
 * @export
 * @class StorageUtil
 */
export default class StorageUtil extends BaseSingleton {

    private storageMap: Map<string, unknown> = new Map();

    public async setup() {
        console.info("StorageUtil setup");
    }

    /**
     * 打印存档到控制台
     *
     * @memberof StorageUtil
     */
    public dumpStorageMap() {
        const data = [];
        this.storageMap.forEach((v, k) => {
            data.push({ key: k, value: v });
        });
        console.table(data);
    }

    /**
     * 清空存档缓存
     *
     * @memberof StorageUtil
     */
    public clearCache() {
        this.storageMap.clear();
    }

    /**
     * 读取存档
     *
     * @param key
     * @param [value]
     * @returns {*}
     * @memberof StorageUtil
     */
    public read(key: EStorageKey, value?: unknown): unknown {
        let result = value;
        const realKey = this.getKey(key);
        if (this.storageMap.has(realKey)) {
            return this.storageMap.get(realKey);
        }
        const userData = JSON.parse(cc.sys.localStorage.getItem(realKey));
        if (userData !== null) {
            result = userData;
        }
        this.storageMap.set(realKey, result);
        return result;
    }

    /**
     * 写入存档
     *
     * @param key
     * @param value
     * @memberof StorageUtil
     */
    public write(key: EStorageKey, value: unknown) {
        const realKey = this.getKey(key);
        this.storageMap.set(realKey, value);
        cc.sys.localStorage.setItem(realKey, JSON.stringify(value));
    }

    /**
     * 删除存档
     *
     * @param key
     * @memberof StorageUtil
     */
    public remove(key: EStorageKey) {
        const realKey = this.getKey(key);
        this.storageMap.delete(realKey);
        cc.sys.localStorage.removeItem(realKey);
    }

    /**
     * 清空存档
     *
     * @memberof StorageUtil
     */
    public clear() {
        this.storageMap.clear();
        cc.sys.localStorage.clear();
    }

    /**
     * 获取真正的 key
     *
     * @private
     * @param key
     * @returns {*}
     * @memberof StorageUtil
     */
    private getKey(key: EStorageKey): string {
        return `${STORAGE_PREFIX}_${key}`;
    }
}
