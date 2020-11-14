/* eslint-disable @typescript-eslint/ban-types */
import * as _ from "lodash";
import BaseSingleton from "../base/BaseSingeton";
import { ENotifyType } from "../Enum";

type NotifyFn = (msg: unknown, notifyType?: ENotifyType) => void;

interface IObserver {
    func: NotifyFn;
    target: object;
}

export default class NotifyUtil extends BaseSingleton {

    private observerMap: Map<ENotifyType, IObserver[]> = new Map();

    private constructor() {
        super();
        for (const key in ENotifyType) {
            if (Object.prototype.hasOwnProperty.call(ENotifyType, key)) {
                const notifyName = ENotifyType[key];
                if (notifyName !== key) {
                    throw new Error(`Definition Error ${key} -> ${notifyName}`);
                }
                this.observerMap.set(notifyName, []);
            }
        }
    }

    public async setup() {
        console.info("NotifyUtil setup");
    }

    /**
     * 注册事件
     *
     * @param notifyType
     * @param notifyFunc
     * @param target
     * @memberof NotifyUtil
     */
    public on(notifyType: ENotifyType, notifyFunc: NotifyFn, target: object) {
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
    public off(notifyType: ENotifyType, notifyFunc: NotifyFn, target: object) {
        _.remove(this.observerMap.get(notifyType), (o) => o.func === notifyFunc && o.target === target);
    }

    /**
     * 发射事件
     *
     * @template T
     * @param notifyType
     * @param [msg=null]
     * @memberof NotifyUtil
     */
    public emit<T>(notifyType: ENotifyType, msg: T = null) {
        this.observerMap.get(notifyType).forEach((obs: IObserver) => {
            if (obs.target) {
                obs.func.call(obs.target, msg, notifyType);
            } else {
                obs.func(msg, notifyType);
            }
        });
    }
}
