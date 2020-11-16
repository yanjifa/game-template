import _ = require("lodash");
import BaseScene from "../base/BaseScene";
import BaseSingleton from "../base/BaseSingeton";
import { ENotifyType } from "../Enum";
import Game from "../Game";
import { ISceneData } from "../Macro";

export default class SceneManager extends BaseSingleton {

    private sceneRootNode: cc.Node = null;

    private currentSceneData: ISceneData = null;

    private goingSceneData: ISceneData = null;

    private currentScene: BaseScene = null;

    public async setup() {
        console.info("SceneManager setup");
    }

    public setSceneRootNode(node: cc.Node) {
        this.sceneRootNode = node;
    }

    public async gotoScene(sceneData: ISceneData, userData?: Record<string, unknown>) {
        if (this.goingSceneData) {
            console.error(`scene [${this.goingSceneData.sceneName}] is going now`);
            return;
        }
        if (this.currentSceneData && this.currentSceneData.sceneName === sceneData.sceneName) {
            console.error(`scene [${this.currentSceneData.sceneName}] is runing now`);
            return;
        }
        const currentSceneResDirs = this.currentSceneData ? this.currentSceneData.resDirs : [];
        const needReleaseResDirs = _.difference(currentSceneResDirs, sceneData.resDirs);
        const needLoadResDirs = _.difference(sceneData.resDirs, currentSceneResDirs);
        try {
            Game.NotifyUtil.emit(ENotifyType.BLOCK_INPUT_SHOW, `gotoScene: ${sceneData.sceneName}`);
            // 加载资源
            await Game.AssetManager.loadDirs(needLoadResDirs);
            // 创建场景
            const prefab = cc.resources.get<cc.Prefab>(sceneData.prefabUrl, cc.Prefab);
            const node = cc.instantiate(prefab);
            node.name = cc.path.basename(sceneData.prefabUrl);
            node.position = cc.Vec3.ZERO;
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
}
