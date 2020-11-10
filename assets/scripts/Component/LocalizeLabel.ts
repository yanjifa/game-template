const {ccclass, property, executeInEditMode, menu, inspector} = cc._decorator;

@ccclass
@executeInEditMode()
@menu("i18n:MAIN_MENU.component.renderers/LocalizeLabel")
@inspector("packages://game-helper/inspectors/localizelabel.js")
export default class LocalizeLabel extends cc.Label {
    @property()
    private _tid: string = "";
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
        super.onLoad();
    }

    private updateString() {
        if (CC_EDITOR && this._tid) {
            Editor.Ipc.sendToMain("game-helper:get-str", this._tid.split(","), (error: Error, str: string) => {
                this.string = str;
            });
        } else {
            //
        }
    }
}
