/**
 * 单例基类, 没什么太大用途
 *
 * @export
 * @class BaseSingleton
 */
export default class BaseSingleton {

    constructor() { /** */ }

    public static getInstance() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const typeClass = this as any;
        if (!typeClass._instance) {
            typeClass._instance = new typeClass();
        }
        return typeClass._instance;
    }
}
