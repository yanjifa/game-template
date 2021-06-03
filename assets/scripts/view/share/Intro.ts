import BasePopView from "../../base/BasePopView";
import { EViewName } from "../../Enum";
import Game from "../../Game";
import { IViewData } from "../../Macro";

const VIEW_DATA: IViewData = {
    viewName: EViewName.INTRO,
    resDirs: [],
    prefabUrl: "share/prefab/Intro",
};

const {ccclass, property} = cc._decorator;

@ccclass
export default class IntroView extends BasePopView {

    private onCloseBtnClicked() {
        this.hidePopView();
    }

    protected async runShowAnim() {
        //
    }

    protected async runHideAnim() {
        //
    }

    public getViewData(): IViewData {
        return VIEW_DATA;
    }
}

Game.PopViewManager.registPopView(VIEW_DATA, IntroView);
