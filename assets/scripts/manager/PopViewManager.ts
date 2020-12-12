import { instantiate, path, Prefab, resources, Vec3, Node } from 'cc';
import BasePopView from '../base/BasePopView';
import BaseSingleton from '../base/BaseSingeton';
import { ENotifyType, EViewName } from '../Enum';
import AppGame from '../AppGame';
import { IViewData } from '../Macro';

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

    private popViewRootNode: Node = null;

    private viewDataMap: Map<EViewName, IGameViewCfg> = new Map();

    private createdPopViews: BasePopView[] = [];

    private createQueue: ICreateQueue[] = [];

    private isCreatingPopView = false;

    public async setup() {
        console.log('PopViewManager setup');
    }

    public setPopViewRootNode(node: Node) {
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
            console.error('popViewRootNode is null');
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

        AppGame.NotifyUtil.emit(ENotifyType.BLOCK_INPUT_SHOW, `createPopView: ${viewData.viewName}`);

        await AppGame.AssetManager.loadDirs(viewData.resDirs);
        const prefab = resources.get<Prefab>(viewData.prefabUrl, Prefab);
        const node = instantiate(prefab);
        node.name = path.basename(viewData.prefabUrl);
        node.position = Vec3.ZERO;
        node.parent = this.popViewRootNode;
        this.isCreatingPopView = false;

        AppGame.NotifyUtil.emit(ENotifyType.BLOCK_INPUT_HIDE, `createPopView: ${viewData.viewName}`);
        // @ts-expect-error
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
        AppGame.AssetManager.releaseDirs(viewData.resDirs);
    }
}
