import BaseScene from "../base/BaseScene";
import { EViewName } from "../Enum";
import Game from "../Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Share extends BaseScene {

    private onBtnClicked(event: cc.Event.EventTouch, viewName: EViewName) {
        Game.PopViewManager.showPopView(viewName);
    }
}
