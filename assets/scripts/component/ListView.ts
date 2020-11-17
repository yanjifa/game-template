import _ = require("lodash");

const { ccclass, property, inspector } = cc._decorator;

const EX_NUM = 1;
const EPSILON = 1e-1;

enum DIRECTION {
    VERTICAL = 1,
    HORIZONTAL = 2,
}
/**
 * 子节点互相间遮挡关系
 */
enum LAYOUT_TYPE {
    START_TO_END = 1,
    END_TO_START = 2,
}

export interface IListAdapter {
    /** 获取列表总条数 */
    getItemCount(listView: ListView): number;
    /** 获取指定索引 Node */
    setItemData(listView: ListView, node: cc.Node, index: number): void;
    /** 获取指定索引 Node 高度 */
    getItemSize(listView: ListView, index: number): cc.Size;
}

@ccclass
@inspector("packages://game-helper/inspectors/listview.js")
export default class ListView extends cc.ScrollView {
    @property(cc.Prefab)
    private listItem: cc.Prefab = null;

    @property({
        type: cc.Enum(DIRECTION),
        tooltip: CC_DEV && " listview 滚动方向",
    })
    set direction(value: DIRECTION) {
        this._direction = value;
        this.vertical = this._direction === DIRECTION.VERTICAL;
        this.horizontal = this._direction === DIRECTION.HORIZONTAL;
    }
    get direction() {
        return this._direction;
    }
    @property()
    private _direction: DIRECTION = DIRECTION.VERTICAL;

    @property({
        type: cc.Enum(LAYOUT_TYPE),
        tooltip: CC_DEV && "子节点布局方式",
    })
    private layoutType: number = LAYOUT_TYPE.START_TO_END;

    set enableScroll(value: boolean) {
        if (this._enableScroll === value) {
            return;
        }
        this._enableScroll = value;
        if (this._enableScroll) {
            // @ts-ignore
            this._registerEvent();
        } else {
            // @ts-ignore
            this._unregisterEvent();
        }
    }
    get enableScroll() {
        return this._enableScroll;
    }
    private _enableScroll = true;

    @property(cc.Integer)
    private paddingLeft = 0;

    @property(cc.Integer)
    private paddingRight = 0;

    @property(cc.Integer)
    private paddingTop = 0;

    @property(cc.Integer)
    private paddingBottom = 0;

    private bufferSize: number = null;

    get items() {
        return this._items;
    }
    private _items: Array<{ node: cc.Node, index: number }> = [];

    private itemNodePool: cc.NodePool = new cc.NodePool();

    private adapter: IListAdapter = null;

    private itemSizeList: cc.Size[] = [];

    private itemPosList: cc.Vec3[] = [];

    private curScrollOffset: cc.Vec2 = null;

    protected onDestroy() {
        this.itemNodePool.clear();
    }

    private getItemNode() {
        const node = this.itemNodePool.get() || cc.instantiate(this.listItem);
        node.stopAllActions();
        node.scale = 1;
        node.active = true;
        node.opacity = 255;
        return node;
    }

    private putItemNode(node: cc.Node) {
        _.remove(this._items, (o) => o.node === node);
        this.itemNodePool.put(node);
    }

    public getItemById(index: number) {
        return _.find(this._items, (item) => item.index === index);
    }

    public async animtedDelOneItem(index: number, duration: number, callBack: () => void) {
        const delItem = this.getItemById(index);
        if (_.isNil(delItem)) {
            console.error("del item not show");
            return;
        }
        const size = this.itemSizeList[index];
        let offset = cc.v3(0, 0, 0);
        if (this.vertical) {
            offset = cc.v3(0, size.height, 0);
        } else {
            offset = cc.v3(-size.width, 0, 0);
        }
        const maxItem = _.maxBy(this._items, (o) => o.index);
        if (maxItem.index + 1 < this.adapter.getItemCount(this) - 1) {
            // 尾部新创建一个
            this.setupItem(maxItem.index + 1);
        }
        delItem.node.stopAllActions();
        delItem.node.runAction(cc.sequence(
            cc.scaleTo(duration / 3, 0),
            cc.callFunc(() => {
                this.putItemNode(delItem.node);
                for (const item of this._items) {
                    if (item.index <= index) {
                        continue;
                    }
                    item.node.stopAllActions();
                    const newPos = item.node.position.add(offset);
                    cc.tween(item.node)
                        .to(duration / 3 * 2, { position: newPos })
                        .start();
                }
            }),
        ));
        this.enableScroll = false;
        this.scheduleOnce(() => {
            callBack();
            this.enableScroll = true;
        }, duration);
    }

    public setAdapter(adapter: IListAdapter, bufferSize?: number) {
        this.adapter = adapter;
        if (bufferSize) {
            this.bufferSize = bufferSize;
        } else {
            this.bufferSize = this.vertical ?
                Math.ceil(this.node.height / this.adapter.getItemSize(this, 0).height) + EX_NUM :
                Math.ceil(this.node.width / this.adapter.getItemSize(this, 0).width) + EX_NUM;
        }
        this.content.position = cc.Vec3.ZERO;
        this.notifyDataSetChanged();
        this.scheduleOnce(() => {
            // 手机上, setadpter 时, 如果有 scale action, 滚动条会错位, 延时一帧强刷一下
            // @ts-ignore
            this.verticalScrollBar && this.verticalScrollBar._onScroll(0);
            // @ts-ignore
            this.horizontalScrollBar && this.horizontalScrollBar._onScroll(0);
        });
    }

    public notifyDataSetChanged() {
        if (!this.adapter) {
            console.warn("please setadpter first");
            return;
        }
        if (!this.node.activeInHierarchy) {
            console.warn("activeInHierarchy is false");
        }
        if (this.adapter.getItemCount(this) <= 0) {
            console.warn("tableview data.length <= 0");
        }
        const offset = this.getScrollOffset();
        // 回收
        while (this._items.length > 0) {
            this.putItemNode(this._items[0].node);
        }
        this.itemPosList.splice(0);
        this.itemSizeList.splice(0);
        const count = this.adapter.getItemCount(this);
        // 计算 content size, 初始化item位置信息
        const contentSize = cc.size(
            this.vertical ? this.content.parent.width : this.paddingLeft + this.paddingRight,
            this.vertical ? this.paddingTop + this.paddingBottom : this.content.parent.height);
        // 先 get 一个获取锚点;
        const node = this.getItemNode();
        const anchor = node.getAnchorPoint();
        this.putItemNode(node);
        for (let index = 0; index < count; index++) {
            const itemSize = this.adapter.getItemSize(this, index);
            this.itemSizeList.push(itemSize);
            if (this.vertical) {
                contentSize.height += itemSize.height;
            } else {
                contentSize.width += itemSize.width;
            }
        }
        const pos = cc.v2(
            this.vertical ? 0 : this.paddingLeft,
            this.vertical ? -this.paddingTop : 0);
        for (let i = 0; i < count; i++) {
            const preSize = this.itemSizeList[i - 1] || cc.size(0, 0);
            if (this.vertical) {
                pos.y -= (preSize.height * anchor.y + this.itemSizeList[i].height * (1 - anchor.y));
            } else {
                pos.x += preSize.width * (1 - anchor.x) + this.itemSizeList[i].width * anchor.x;
            }
            this.itemPosList.push(cc.v3(pos.x, pos.y));
        }
        if (this.vertical) {
            contentSize.height = Math.max(contentSize.height, this.content.parent.height);
            this.verticalScrollBar && (this.verticalScrollBar.node.active = contentSize.height > this.content.parent.height);
            this.content.setContentSize(contentSize);
        } else {
            contentSize.width = Math.max(contentSize.width, this.content.parent.width);
            this.horizontalScrollBar && (this.horizontalScrollBar.node.active = contentSize.width > this.content.parent.width);
            this.content.setContentSize(contentSize);
        }
        this.curScrollOffset = null;
        // 创建 item
        this.updateViewItems(offset);
    }

    private setupItem(index: number) {
        const node = this.getItemNode();
        node.position = this.getItemPosition(index);
        node.zIndex = this.layoutType === LAYOUT_TYPE.START_TO_END ? index : cc.macro.MAX_ZINDEX - index;
        node.parent = this.content;
        this.adapter.setItemData(this, node, index);
        this._items.push({ node: node, index: index });
    }

    private getItemPosition(index: number) {
        return this.itemPosList[index];
    }

    protected lateUpdate() {
        if (_.isNil(this.adapter)) {
            return;
        }
        const offset = this.getScrollOffset();
        if (this.curScrollOffset && offset.fuzzyEquals(this.curScrollOffset, EPSILON)) {
            return;
        }
        this.updateViewItems(offset);
        this.curScrollOffset = offset;
    }

    private updateViewItems(offset: cc.Vec2) {
        let centerIndex = null;
        if (this.vertical) {
            // 垂直滚动
            const centerPos = _.first(_.sortBy(this.itemPosList, (o) => Math.abs(o.y + offset.y + this.content.parent.height / 2)));
            centerIndex = _.findIndex(this.itemPosList, (o) => o.y === centerPos.y);
        } else {
            // 横向滚动
            const centerPos = _.first(_.sortBy(this.itemPosList, (o) => Math.abs(o.x + offset.x - this.content.parent.width / 2)));
            centerIndex = _.findIndex(this.itemPosList, (o) => o.x === centerPos.x);
        }
        const count = this.adapter.getItemCount(this);
        const newIndexs = [];
        const startIndex = centerIndex - Math.floor(this.bufferSize / 2);
        const endIndex = startIndex + this.bufferSize;
        for (let i = startIndex; i <= endIndex; i++) {
            if (i >= 0 && i < count) {
                newIndexs.push(i);
            }
        }
        const curIndexs = _.map(this._items, (o) => o.index);
        const releaseIndexs = _.difference(curIndexs, newIndexs);
        const loadIndexs = _.difference(newIndexs, curIndexs);
        // 回收
        for (const index of releaseIndexs) {
            const item = _.find(this._items, (o) => o.index === index);
            this.putItemNode(item.node);
        }
        // 创建
        for (const index of loadIndexs) {
            this.setupItem(index);
        }
    }
}
