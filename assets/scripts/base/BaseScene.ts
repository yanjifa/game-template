import { ESceneName } from "../Enum";

const { ccclass } = cc._decorator;

/**
 * 场景基类
 *
 * @export
 * @class BaseScene
 */
@ccclass
export default class BaseScene extends cc.Component {

    public async willEnter(userData?: Record<string, unknown>) {
        //
    }

    public didEnter(data?: Record<string, unknown>) {
        //
    }

    public async willLeave(userData?: Record<string, unknown>) {
        //
    }

    public didLeave() {
        //
    }
}
