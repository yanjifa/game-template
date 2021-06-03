import BasePopView from "../../base/BasePopView";
import { EViewName } from "../../Enum";
import Game from "../../Game";
import { IViewData } from "../../Macro";

const VIEW_DATA: IViewData = {
    viewName: EViewName.RASTERIZATION,
    resDirs: [],
    prefabUrl: "share/prefab/Rasterization",
};

const {ccclass, property} = cc._decorator;

@ccclass
export default class RasterizationView extends BasePopView {

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

Game.PopViewManager.registPopView(VIEW_DATA, RasterizationView);
