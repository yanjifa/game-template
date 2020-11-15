import BasePopView from "../../base/BasePopView";
import ListView, { IListAdapter } from "../../component/ListView";
import { EViewName } from "../../Enum";
import Game from "../../Game";
import { IViewData } from "../../Macro";
import ListViewDemoItem from "./ListViewDemoItem";

const {ccclass, property} = cc._decorator;

const VIEW_DATA: IViewData = {
    viewName: EViewName.LIST_VIEW_DEMO,
    resDirs: ["listview"],
    prefabUrl: "listview/prefab/ListViewDemo",
};

@ccclass
export default class ListViewDemo extends BasePopView implements IListAdapter {
    @property(ListView)
    private listView: ListView = null;

    public initPopView() {
        this.listView.setAdapter(this);
    }

    private onCloseBtnClicked() {
        this.hidePopView();
    }

    // ------------------------------- implements from ListAdapter -------------------------------//
    public getItemCount(listView: ListView): number {
        return 100;
    }

    public setItemData(listView: ListView, node: cc.Node, index: number): void {
        node.getComponent(ListViewDemoItem).setData(index);
    }

    public getItemSize(listView: ListView, index: number): cc.Size {
        return cc.size(770, 100);
    }
    // ------------------------------- implements from ListAdapter -------------------------------//

    public getViewData(): IViewData {
        return VIEW_DATA;
    }
}

Game.PopViewManager.registPopView(VIEW_DATA, ListViewDemo);
