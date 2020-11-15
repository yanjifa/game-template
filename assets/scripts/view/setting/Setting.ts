import BasePopView from "../../base/BasePopView";
import { ELanguageType, ENotifyType, EViewName } from "../../Enum";
import Game from "../../Game";
import { IViewData } from "../../Macro";

const {ccclass, property} = cc._decorator;

const VIEW_DATA: IViewData = {
    viewName: EViewName.SETTING,
    resDirs: ["setting"],
    prefabUrl: "setting/prefab/Setting",
};

@ccclass
export default class Setting extends BasePopView {

    private onLanguageBtnClicked(event: cc.Event.EventTouch, lang: ELanguageType) {
        Game.LocalizeUtil.changeLanguage(lang);
    }

    private onCloseBtnClicked() {
        this.hidePopView();
    }

    public getViewData(): IViewData {
        return VIEW_DATA;
    }
}

Game.PopViewManager.registPopView(VIEW_DATA, Setting);
