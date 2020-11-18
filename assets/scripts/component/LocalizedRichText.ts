import { ENotifyType } from "../Enum";
import Game from "../Game";

const {ccclass, property, executeInEditMode, menu, inspector} = cc._decorator;

@ccclass
@executeInEditMode()
@menu(`${CC_EDITOR && Editor.T("game-helper.projectcomponent")}/LocalizedRichText`)
@inspector("packages://game-helper/inspectors/localizedrichtext.js")
export default class LocalizedRichText extends cc.RichText {
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

    protected onLoad() {
        Game.NotifyUtil.on(ENotifyType.LANGUAGE_CHANGED, this.onLanguageChanged, this);
        this.updateString();

    }

    protected onDestroy() {
        Game.NotifyUtil.off(ENotifyType.LANGUAGE_CHANGED, this.onLanguageChanged, this);
        super.onDestroy();
    }

    private onLanguageChanged() {
        this.updateString();
    }

    private updateString() {
        if (!this._tid) {
            return;
        }
        if (CC_EDITOR) {
            Editor.Ipc.sendToMain("game-helper:getLangStr", this._tid, (e: Error, str: string) => {
                if (e) {
                    return;
                }
                this.string = "" + str;
            });
        } else {
            const str = "" + Game.LocalizeUtil.getLangStr(this._tid);
            this.string !== str && (this.string = str);
        }
    }
}
