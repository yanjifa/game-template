import { ENotifyType } from "../Enum";
import Game from "../Game";

const {ccclass, property, executeInEditMode, menu, inspector} = cc._decorator;

@ccclass
@executeInEditMode()
@menu(`${CC_EDITOR && Editor.T("game-helper.projectcomponent")}/LocalizedSprite`)
@inspector("packages://game-helper/inspectors/localizedsprite.js")
export default class LocalizedSprite extends cc.Sprite {
    @property()
    private _spriteUrl = "";
    @property()
    set spriteUrl(value: string) {
        this._spriteUrl = value;
        this.updateSpriteFrame();
    }
    get spriteUrl() {
        return this._spriteUrl;
    }

    protected onLoad() {
        Game.NotifyUtil.on(ENotifyType.LANGUAGE_CHANGED, this.onLanguageChanged, this);
        this.updateSpriteFrame();
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
        if (CC_EDITOR) {
            return;
        }
        if (!this._spriteUrl) {
            return;
        }
        if (this._spriteUrl) {
            const lang = Game.LocalizeUtil.language;
            this.spriteFrame = cc.resources.get<cc.SpriteFrame>(this._spriteUrl.replace("${lang}", lang), cc.SpriteFrame);
        }
    }
}
