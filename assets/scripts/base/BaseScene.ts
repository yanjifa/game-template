
import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseScene')
export default class BaseScene extends Component {
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
