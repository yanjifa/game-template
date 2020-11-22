import BaseScene from "../base/BaseScene";
import { EViewName } from "../Enum";
import Game from "../Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Home extends BaseScene {
    @property(cc.Node)
    private avatarRoot: cc.Node = null;

    public didEnter() {
        this.avatarRoot.children.forEach((node, index) => {
            node.getComponent(cc.Sprite).getMaterial(0).setProperty("edge", 0.05 * index);
            // node.getComponent(cc.Sprite).getMaterial(0).setProperty("edge", 0.15);
        });
    }

    private onSettingBtnClicked() {
        Game.PopViewManager.showPopView(EViewName.SETTING);
    }

    private onListViewBtnClicked() {
        Game.PopViewManager.showPopView(EViewName.LIST_VIEW_DEMO);
    }
}
