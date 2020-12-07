// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { RichText, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LocalizedRichText')
export class LocalizedRichText extends RichText {

}
