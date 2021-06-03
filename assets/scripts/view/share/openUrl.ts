
const {ccclass, property} = cc._decorator;

@ccclass
export default class openUrl extends cc.Component {
    @property()
    private url = "";

    protected onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.sys.openURL(this.url);
        });
    }
}
