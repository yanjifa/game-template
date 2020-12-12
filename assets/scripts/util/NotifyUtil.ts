import BaseSingleton from '../base/BaseSingeton';
import { ENotifyType } from '../Enum';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotifyFn = (userData: any, notifyType?: ENotifyType) => void;

interface IObserver {
    func: NotifyFn;
    target: unknown;
}

/**
 * 全局事件
 *
 * @export
 * @class NotifyUtil
 */
export default class NotifyUtil extends BaseSingleton {

    private observerMap: Map<ENotifyType, IObserver[]> = new Map();

    private constructor() {
        super();
        // 检查 ENotifyType 拼写, 并初始化 observerMap
        for (const key in ENotifyType) {
            if (Object.prototype.hasOwnProperty.call(ENotifyType, key)) {
                // @ts-expect-error
                const notifyName = ENotifyType[key];
                if (notifyName !== key) {
                    throw new Error(`Definition Error ${key} -> ${notifyName}`);
                }
                this.observerMap.set(notifyName, []);
            }
        }
    }

    public async setup() {
        console.log('NotifyUtil setup');
    }

    /**
     * 注册事件
     *
     * @param notifyType
     * @param notifyFunc
     * @param target
     * @memberof NotifyUtil
     */
    public on(notifyType: ENotifyType, notifyFunc: NotifyFn, target: unknown) {
        this.observerMap.get(notifyType).push({ func: notifyFunc, target: target });
    }

    /**
     * 移除事件
     *
     * @param notifyType
     * @param notifyFunc
     * @param target
     * @memberof NotifyUtil
     */
    public off(notifyType: ENotifyType, notifyFunc: NotifyFn, target: unknown) {
        const observers = this.observerMap.get(notifyType);
        const index = observers.findIndex((o) => o.func === notifyFunc && o.target === target);
        index >= 0 && observers.splice(index, 1);
    }

    /**
     * 发射事件
     *
     * @template T
     * @param notifyType
     * @param [userData=null]
     * @memberof NotifyUtil
     */
    public emit<T extends unknown>(notifyType: ENotifyType, userData: T = null) {
        this.observerMap.get(notifyType).forEach((obs: IObserver) => {
            if (obs.target) {
                obs.func.call(obs.target, userData, notifyType);
            } else {
                obs.func(userData, notifyType);
            }
        });
    }
}
