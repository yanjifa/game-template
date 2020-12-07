// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SpriteComponent, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LocalizedSprite')
export class LocalizedSprite extends SpriteComponent {
}
