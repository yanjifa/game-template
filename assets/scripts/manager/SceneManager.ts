import { instantiate, Node, path, Prefab, resources, Vec3 } from 'cc';
import BaseScene from '../base/BaseScene';
import BaseSingleton from '../base/BaseSingeton';
import { ENotifyType } from '../Enum';
import Game from '../Game';
import { ISceneData } from '../Macro';

/**
 * 场景管理器
 *
 * @export
 * @class SceneManager
 */
export default class SceneManager extends BaseSingleton {
    /** 场景根节点 */
    private sceneRootNode: Node = null;
    /** 当前运行的场景数据 */
    private currentSceneData: ISceneData = null;
    /** 正在前往的场景数据 */
    private goingSceneData: ISceneData = null;
    /** 当前运行的尝试实例 */
    private currentScene: BaseScene = null;

    public async setup() {
        console.log('SceneManager setup');
    }

    public setSceneRootNode(node: Node) {
        this.sceneRootNode = node;
    }

    /**
     * 切换场景
     *
     * @param sceneData
     * @param [userData]
     * @returns {*}
     * @memberof SceneManager
     */
    public async gotoScene(sceneData: ISceneData, userData?: Record<string, unknown>): Promise<void> {
        if (this.goingSceneData) {
            console.error(`scene [${this.goingSceneData.sceneName}] is going now`);
            return;
        }
        if (this.currentSceneData && this.currentSceneData.sceneName === sceneData.sceneName) {
            console.error(`scene [${this.currentSceneData.sceneName}] is runing now`);
            return;
        }
        const currentSceneResDirs = this.currentSceneData ? this.currentSceneData.resDirs : [];
        const needReleaseResDirs = this.difference(currentSceneResDirs, sceneData.resDirs);
        const needLoadResDirs = this.difference(sceneData.resDirs, currentSceneResDirs);
        console.log('gotoScene', needLoadResDirs);
        try {
            Game.NotifyUtil.emit(ENotifyType.BLOCK_INPUT_SHOW, `gotoScene: ${sceneData.sceneName}`);
            // 加载资源
            await Game.AssetManager.loadDirs(needLoadResDirs);
            // 创建场景
            const prefab = resources.get<Prefab>(sceneData.prefabUrl, Prefab);
            const node = instantiate(prefab);
            node.name = path.basename(sceneData.prefabUrl);
            node.position = Vec3.ZERO;
            node.parent = this.sceneRootNode;
            const newScene = node.getComponent(BaseScene);
            await newScene.willEnter(userData);
            newScene.didEnter();
            // 切换场景通知
            Game.NotifyUtil.emit(ENotifyType.SWITCH_SCENE, {
                from: this.currentSceneData ? this.currentSceneData.sceneName : null,
                to: sceneData.sceneName,
            });
            // 释放资源
            if (this.currentScene) {
                await this.currentScene.willLeave();
                this.currentScene.didLeave();
                this.currentScene.node.destroy();
            }
            Game.AssetManager.releaseDirs(needReleaseResDirs);
            this.currentSceneData = sceneData;
            this.currentScene = newScene;
        } catch (e) {
            console.error(e);
        } finally {
            Game.NotifyUtil.emit(ENotifyType.BLOCK_INPUT_HIDE, `gotoScene: ${sceneData.sceneName}`);
        }
    }

    /**
     * npm 不支持前的替代方法
     *
     * @private
     * @param a
     * @param b
     * @returns {*}
     * @memberof SceneManager
     */
    private difference(a: string[], b: string[]): string[] {
        const c: string[] = [];
        a.forEach((o) => {
            if (b.findIndex((o1) => o1 === o) === -1) {
                c.push(o);
            }
        });
        return c;
    }
}
