import BasePopView from "../../base/BasePopView";
import { ENotifyType, EViewName } from "../../Enum";
import Game from "../../Game";
import { IViewData } from "../../Macro";

const VIEW_DATA: IViewData = {
    viewName: EViewName.SHADER,
    resDirs: [],
    prefabUrl: "share/prefab/Shader",
};

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShaderView extends BasePopView {

    private onCloseBtnClicked() {
        this.hidePopView();
    }

    private onEffectBtnClicked() {
        Game.NotifyUtil.emit(ENotifyType.CAMEAR_EFFECT);
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

Game.PopViewManager.registPopView(VIEW_DATA, ShaderView);
