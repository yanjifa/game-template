import BaseScene from "../base/BaseScene";
import { EViewName } from "../Enum";
import Game from "../Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Home extends BaseScene {

    private onSettingBtnClicked() {
        Game.PopViewManager.showPopView(EViewName.SETTING);
    }

    private onListViewBtnClicked() {
        Game.PopViewManager.showPopView(EViewName.LIST_VIEW_DEMO);
    }
}
