import { ENotifyType } from "../Enum";
import Game from "../Game";

const {ccclass, property, executeInEditMode, menu, inspector} = cc._decorator;

@ccclass
@executeInEditMode()
@menu(`${CC_EDITOR && Editor.T("game-helper.projectcomponent")}/LocalizedLabel`)
@inspector("packages://game-helper/inspectors/localizedlabel.js")
export default class LocalizedLabel extends cc.Label {
    @property()
    private _tid = "";
    @property({
        multiline: true,
        tooltip: "多语言 text id",
    })
    set tid(value: string) {
        this._tid = value;
        this.updateString();
    }
    get tid() {
        return this._tid;
    }
    @property()
    private _bmfontUrl = "";
    @property({
        tooltip: "动态加载 bmfonturl",
    })
    set bmfontUrl(value: string) {
        this._bmfontUrl = value;
        this.updateString();
    }
    get bmfontUrl() {
        return this._bmfontUrl;
    }

    protected onLoad() {
        super.onLoad();
        Game.NotifyUtil.on(ENotifyType.LANGUAGE_CHANGED, this.onLanguageChanged, this);
        this.updateString();
    }

    protected onDestroy() {
        Game.NotifyUtil.off(ENotifyType.LANGUAGE_CHANGED, this.onLanguageChanged, this);
        super.onDestroy();
    }

    /**
     * 收到语言变更通知
     *
     * @private
     * @memberof LocalizedLabel
     */
    private onLanguageChanged() {
        this.updateString();
    }

    /**
     * 更新文本
     *
     * @private
     * @returns {*}
     * @memberof LocalizedLabel
     */
    private updateString(): void {
        if (!this._tid) {
            return;
        }
        if (CC_EDITOR) {
            // 编辑器模式下, 从插件中获取文本
            Editor.Ipc.sendToMain("game-helper:getLangStr", this._tid, (e: Error, str: string) => {
                if (e) {
                    return;
                }
                this.string = "" + str;
            });
        } else {
            // 获取多语言文本
            this.string = "" + Game.LocalizeUtil.getLangStr(this._tid);
            // 如果使用了 bmfont, 切换对应语言的 bmfont
            // _bmfontUrl 为自动生成, 一般情况下不需要手动维护
            if (this._bmfontUrl) {
                const lang = Game.LocalizeUtil.language;
                this.font = cc.resources.get<cc.BitmapFont>(this._bmfontUrl.replace("${lang}", lang), cc.BitmapFont);
            }
        }
    }
}
