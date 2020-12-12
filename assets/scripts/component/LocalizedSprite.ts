
import { resources, SpriteComponent, SpriteFrame, _decorator } from 'cc';
import { EDITOR } from 'cce.env';
import AppGame from '../AppGame';
import { ENotifyType } from '../Enum';

const { ccclass, property, menu } = _decorator;

@ccclass('LocalizedSprite')
@menu('Localized/LocalizedSprite')
export class LocalizedSprite extends SpriteComponent {
    @property
    private _spriteUrl = '';

    @property({
        displayOrder: 3,
        tooltip: 'spriteFrame url, 语言目录使用 ${lang} 表示',
    })
    set spriteUrl(value: string) {
        this._spriteUrl = value;
        this.updateSpriteFrame();
    }
    get spriteUrl() {
        return this._spriteUrl;
    }

    protected onLoad() {
        AppGame.NotifyUtil.on(ENotifyType.LANGUAGE_CHANGED, this.onLanguageChanged, this);
        this.updateSpriteFrame();
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
        this.updateSpriteFrame();
    }

    /**
     * 更新 spriteFrame
     *
     * @private
     * @returns {*}
     * @memberof LocalizedLabel
     */
    private updateSpriteFrame(): void {
        if (EDITOR) {
            return;
        }
        if (!this._spriteUrl) {
            return;
        }
        if (this._spriteUrl) {
            const lang = AppGame.LocalizeUtil.language;
            this.spriteFrame.decRef();
            const sf = resources.get<SpriteFrame>(this._spriteUrl.replace('${lang}', lang) + '/spriteFrame', SpriteFrame);
            this.spriteFrame = sf;
            sf.addRef();
        }
    }
}
