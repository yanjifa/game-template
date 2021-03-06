import { _decorator, Label, macro, EventTouch } from 'cc';
import AppGame from '../AppGame';
import BaseScene from '../base/BaseScene';
import { ELanguageType } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('Home')
export class Home extends BaseScene {

    @property(Label)
    private timeLabel: Label = null;

    public didEnter() {
        this.clientTick();
        this.schedule(this.clientTick, 1.0, macro.REPEAT_FOREVER);
    }

    public async willLeave(userData?: Record<string, unknown>) {
        this.unschedule(this.clientTick);
    }

    private clientTick() {
        const now = new Date();
        const hour = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const sec = now.getSeconds().toString().padStart(2, '0');
        this.timeLabel.tid = `TID_LABEL_TIME,${hour}:${minutes}:${sec}`;
    }

    private onLangBtnClicked(event: EventTouch, lang: string) {
        AppGame.LocalizeUtil.changeLanguage(lang as ELanguageType);
    }
}
