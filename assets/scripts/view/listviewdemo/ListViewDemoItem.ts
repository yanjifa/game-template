
const {ccclass, property} = cc._decorator;

@ccclass
export default class ListViewDemoItem extends cc.Component {
    @property(cc.Label)
    private label: cc.Label = null;

    public setData(index: number) {
        this.label.string = `${index}`;
    }
}
