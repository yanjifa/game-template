
import { _decorator, Node } from 'cc';
import BasePopView from '../base/BasePopView';
import { IViewData } from '../Macro';
const { ccclass, property } = _decorator;

@ccclass('Setting')
export class Setting extends BasePopView {
    public getViewData(): IViewData {
        throw new Error('Method not implemented.');
    }

}
