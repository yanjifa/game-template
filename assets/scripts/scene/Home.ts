import BaseScene from "../base/BaseScene";
import { EViewName } from "../Enum";
import Game from "../Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Home extends BaseScene {
    @property(cc.Label)
    private timeLabel: cc.Label = null;

    public didEnter() {
        this.schedule(this.clientTick, 1.0, cc.macro.REPEAT_FOREVER);
    }

    public async willLeave(userData?: Record<string, unknown>) {
        this.unschedule(this.clientTick);
    }

    private clientTick() {
        const now = new Date();
        const hour = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const sec = now.getSeconds().toString().padStart(2, "0");
        this.timeLabel.tid = `TID_LABEL_TIME,${hour}:${minutes}:${sec}`;
    }

    private onSettingBtnClicked() {
        Game.PopViewManager.showPopView(EViewName.SETTING);
    }

    private onListViewBtnClicked() {
        Game.PopViewManager.showPopView(EViewName.LIST_VIEW_DEMO);
    }
}
