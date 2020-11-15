import Bluebird = require("bluebird");
import { ENotifyType } from "../Enum";
import Game from "../Game";
import { IViewData } from "../Macro";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class BasePopView extends cc.Component {
    @property({
        type: cc.Node,
        tooltip: "蒙黑节点",
    })
    protected maskNode: cc.Node = null;

    @property({
        type: cc.Node,
        tooltip: "弹出框根节点",
    })
    protected rootNode: cc.Node = null;

    protected getShowAudioUrl() {
        return "common/audio/ui_panel_open";
    }

    public static async prepareData(data: Record<string, string>) {
        return data;
    }

    public initPopView(data: Record<string, unknown>) {
        //
    }
    /**
     * 子类不要覆盖, 定制动画请重写 runShowAnim
     *
     * @protected
     * @param {boolean} [skipAnim=false]
     * @memberof BasePopView
     */
    public async showPopView(skipAnim?: boolean) {
        this.onShowBegin();
        try {
            Game.NotifyUtil.emit(ENotifyType.BLOCK_INPUT_SHOW, `show:${this.getViewData().viewName}`);
            this.playShowAudio(skipAnim);
            await this.runShowAnim(skipAnim);
            if (this.isFullScreen()) {
                Game.PopViewManager.fullScreenViewRefNum += 1;
            }
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            Game.NotifyUtil.emit(ENotifyType.BLOCK_INPUT_HIDE, `show:${this.getViewData().viewName}`);
        }
        this.onShowDone();
    }

    protected onShowBegin() {
        //
    }

    protected playShowAudio(skipAudio?: boolean) {
        if (skipAudio) {
            return;
        }
        const audioUrl = this.getShowAudioUrl();
        if (!audioUrl) {
            return;
        }
        Game.AudioManager.playEffect(audioUrl);
    }

    protected async runShowAnim(skipAnim?: boolean): Promise<void> {
        if (skipAnim) {
            return;
        }
        if (!this.rootNode || !this.maskNode) {
            console.log("skip show anim");
            return;
        }
        await Bluebird.fromCallback((callback) => {
            const originScale = this.rootNode.scale;
            this.rootNode.scale = 0;
            this.maskNode.opacity = 0;
            cc.tween(this.rootNode)
                .to(0.25, { scale: originScale }, {easing: "backOut"})
                .call(() => { callback(null) })
                .start();
            cc.tween(this.maskNode)
                .to(0.25, { opacity: 200 })
                .start();
        });
    }

    protected onShowDone() {
        //
    }

    /**
     * 子类不要覆盖此函数, 定制动画重写 runHideAnim
     *
     * @protected
     * @param {boolean} [skipAnim=false]
     * @memberof BasePopView
     */
    protected async hidePopView(skipAnim = false) {
        Game.NotifyUtil.emit(ENotifyType.BLOCK_INPUT_SHOW, `hide:${this.getViewData().viewName}`);
        this.onHideBegin();
        if (this.isFullScreen()) {
            Game.PopViewManager.fullScreenViewRefNum -= 1;
        }
        await this.runHideAnim(skipAnim);
        this.onHideDone();
        Game.PopViewManager.destroyPopView(this);
        Game.NotifyUtil.emit(ENotifyType.BLOCK_INPUT_HIDE, `hide:${this.getViewData().viewName}`);
    }

    protected onHideBegin() {
        //
    }

    protected async runHideAnim(skipAnim = false) {
        if (skipAnim) {
            return;
        }
        if (!this.rootNode || !this.maskNode) {
            console.log("skip hide anim");
            return;
        }
        await Bluebird.fromCallback((callback) => {
            cc.tween(this.rootNode)
                .to(0.25, { scale: 0 }, {easing: "backIn"})
                .call(() => { callback(null) })
                .start();
            cc.tween(this.maskNode)
                .to(0.25, { opacity: 0 })
                .start();
        });
    }

    protected onHideDone() {
        //
    }

    /**
     * 只有 Topview 关闭时, 自己变成 Topview 时触发
     *
     * @protected
     * @memberof BasePopView
     */
    public onFocus() {
        //
    }

    /**
     * 当前 view 被新的 Topview 盖住时触发, 覆盖多个时只有第一次触发
     *
     * @protected
     * @memberof BasePopView
     */
    public onLostFocus() {
        //
    }

    /**
     * 获取当前界面的相关信息
     *
     * @abstract
     * @returns {IViewData}
     * @memberof BasePopView
     */
    public abstract getViewData(): IViewData;

    /**
     * 是否为全屏界面
     *
     * @protected
     * @returns
     * @memberof BasePopView
     */
    protected isFullScreen() {
        return false;
    }
}
