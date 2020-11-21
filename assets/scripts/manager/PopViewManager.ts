import BasePopView from "../base/BasePopView";
import BaseSingleton from "../base/BaseSingeton";
import { ENotifyType, EViewName } from "../Enum";
import Game from "../Game";
import { IViewData } from "../Macro";

interface IGameViewCfg {
    viewData: IViewData;
    viewClass: BasePopView;
}

interface ICreateQueue {
    viewCfg: IGameViewCfg;
    userData: Record<string, unknown>;
}

/**
 * popview 管理器, 注册 view, 显示 view
 *
 * @export
 * @class PopViewManager
 */
export default class PopViewManager extends BaseSingleton {

    get fullScreenViewRefNum() {
        return this._fullScreenViewRefNum;
    }
    set fullScreenViewRefNum(value: number) {
        this._fullScreenViewRefNum = value;
    }
    private _fullScreenViewRefNum = 0;

    private popViewRootNode: cc.Node = null;

    private viewDataMap: Map<EViewName, IGameViewCfg> = new Map();

    private createdPopViews: BasePopView[] = [];

    private createQueue: ICreateQueue[] = [];

    private isCreatingPopView = false;

    public async setup() {
        console.log("PopViewManager setup");
    }

    public setPopViewRootNode(node: cc.Node) {
        this.popViewRootNode = node;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public registPopView(viewData: IViewData, viewClass: any) {
        this.viewDataMap.set(viewData.viewName, { viewData, viewClass });
    }

    public async showPopView(viewName: EViewName, userData?: Record<string, unknown>) {
        const viewCfg = this.viewDataMap.get(viewName);
        if (!viewCfg) {
            console.warn(`view: ${viewName} not regist`);
            return;
        }
        if (!this.popViewRootNode) {
            console.error("popViewRootNode is null");
        }
        this.createQueue.push({ viewCfg, userData });
        if (!this.isCreatingPopView) {
            await this.createPopView();
        }
    }

    private async createPopView() {
        const createData = this.createQueue.shift();
        if (!createData) {
            return;
        }
        this.isCreatingPopView = true;
        const viewData = createData.viewCfg.viewData;

        Game.NotifyUtil.emit(ENotifyType.BLOCK_INPUT_SHOW, `createPopView: ${viewData.viewName}`);

        await Game.AssetManager.loadDirs(viewData.resDirs);
        const prefab = cc.resources.get<cc.Prefab>(viewData.prefabUrl, cc.Prefab);
        const node = cc.instantiate(prefab);
        node.name = cc.path.basename(viewData.prefabUrl);
        node.position = cc.Vec3.ZERO;
        node.parent = this.popViewRootNode;
        this.isCreatingPopView = false;

        Game.NotifyUtil.emit(ENotifyType.BLOCK_INPUT_HIDE, `createPopView: ${viewData.viewName}`);

        const popView = node.getComponent(BasePopView);
        const curTopView = this.createdPopViews[this.createdPopViews.length - 1];
        if (curTopView) {
            curTopView.onLostFocus();
            console.log(`view: ${viewData.viewName} onLostFocus`);
        }

        this.createdPopViews.push(popView);
        popView.initPopView(createData.userData);
        await popView.showPopView();
        // 递归创建队列中的 view
        await this.createPopView();
    }

    public destroyPopView(popView: BasePopView) {
        const viewData = popView.getViewData();
        const viewIndex = this.createdPopViews.findIndex((o) => o === popView);
        if (viewIndex === -1) {
            return;
        }
        const isTopView = viewIndex === this.createdPopViews.length - 1;
        this.createdPopViews.splice(viewIndex, 1);
        popView.node.destroy();
        if (isTopView && this.createdPopViews.length > 0) {
            const curTopView = this.createdPopViews[this.createdPopViews.length - 1];
            curTopView.onFocus();
            console.log(`view: ${viewData.viewName} onFocus`);
        }
        Game.AssetManager.releaseDirs(viewData.resDirs);
    }
}
