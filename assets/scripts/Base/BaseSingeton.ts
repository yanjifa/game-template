export default class BaseSingleton {
    public constructor() { }

    public static getInstance() {
        const typeClass = this as any;
        if (!typeClass._instance) {
            typeClass._instance = new typeClass();
        }
        return typeClass._instance;
    }
}
