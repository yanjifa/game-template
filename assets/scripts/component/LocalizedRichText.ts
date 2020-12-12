
import { RichText, _decorator } from 'cc';
import { EDITOR } from 'cce.env';
import AppGame from '../AppGame';
import { ENotifyType, HELPER_PK_NAME } from '../Enum';

const { ccclass, property, executeInEditMode, menu } = _decorator;

@ccclass('LocalizedRichText')
@executeInEditMode
@menu('Localized/LocalizedRichText')
export class LocalizedRichText extends RichText {
    @property
    private _tid = 'tid';

    @property({
        multiline: true,
        displayOrder: 3,
        tooltip: '多语言 text id',
    })
    set tid(value: string) {
        this._tid = value;
        this.updateString();
    }
    get tid() {
        return this._tid;
    }

    protected onLoad() {
        this.updateString();
        AppGame.NotifyUtil.on(ENotifyType.LANGUAGE_CHANGED, this.onLanguageChanged, this);
    }

    public onDestroy() {
        AppGame.NotifyUtil.off(ENotifyType.LANGUAGE_CHANGED, this.onLanguageChanged, this);
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
        if (EDITOR) {
            // 编辑器模式下, 从插件中获取文本
            console.log(this._tid);
            this.editorUpdateString();
            return;
        }
        // 获取多语言文本
        this.string = '' + AppGame.LocalizeUtil.getLangStr(this._tid);
    }

    private async editorUpdateString() {
        const str = await Editor.Message.request(HELPER_PK_NAME, 'getLangStr', this._tid);
        this.string = '' + str;
    }
}
