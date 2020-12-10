
import { BitmapFont, Label, resources, _decorator } from 'cc';
import { EDITOR } from 'cce.env';
import AppGame from '../AppGame';
import { ENotifyType, HELPER_PK_NAME } from '../Enum';

const { ccclass, property, executeInEditMode, menu } = _decorator;

@ccclass('LocalizedLabel')
@executeInEditMode
@menu('Localized/LocalizedLabel')
export class LocalizedLabel extends Label {
    @property
    private _tid = '';

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

    @property
    private _bmfontUrl = '';
    @property({
        displayOrder: 2,
        visible: function(this: LocalizedLabel) { return this.font instanceof BitmapFont },
    })
    set bmfontUrl(value: string) {
        this._bmfontUrl = value;
        this.updateString();
    }
    get bmfontUrl() {
        return this._bmfontUrl;
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
        // 如果使用了 bmfont, 切换对应语言的 bmfont
        if (!this.useSystemFont && this._bmfontUrl) {
            this.font.decRef();
            const lang = AppGame.LocalizeUtil.language;
            const font = resources.get<BitmapFont>(this._bmfontUrl.replace('${lang}', lang), BitmapFont);
            this.font = font;
            font.addRef();
        }
    }

    private async editorUpdateString() {
        const str = await Editor.Message.request(HELPER_PK_NAME, 'getLangStr', this._tid);
        this.string = '' + str;
    }
}
