import { ENotifyType, ESceneName } from "./Enum";
import Game from "./Game";

const {ccclass, property} = cc._decorator;

const TEST = true;

@ccclass
export default class Main extends cc.Component {
    @property(cc.Node)
    private sceneRootNode: cc.Node = null;

    @property(cc.Node)
    private popViewRootNode: cc.Node = null;

    @property(cc.Node)
    private blockInputNode: cc.Node = null;

    @property(cc.Node)
    private blockRedDot: cc.Node = null;

    @property(cc.Label)
    private blockStateLabel: cc.Label = null;

    @property(cc.Node)
    private LoadingNode: cc.Node = null;

    @property(cc.Node)
    private loadAnimNode: cc.Node = null;

    private blockInputRefNum = 0;

    private blockReasons: string[] = [];

    protected onLoad() {
        window["Game"] = Game;
        // 加载动画顶层遮罩
        this.LoadingNode.active = true;
        cc.tween(this.loadAnimNode).by(0.1, { angle: -40 }).repeatForever().start();
        //
        this.updateBlockInput();
        this.blockRedDot.active = TEST;
        this.blockStateLabel.node.active = TEST;
    }

    protected onDestroy() {
        Game.NotifyUtil.off(ENotifyType.BLOCK_INPUT_SHOW, this.showBlockInput, this);
        Game.NotifyUtil.off(ENotifyType.BLOCK_INPUT_HIDE, this.hideBlockInput, this);
    }

    protected async start() {
        await this.gameSetup();
        Game.NotifyUtil.on(ENotifyType.BLOCK_INPUT_SHOW, this.showBlockInput, this);
        Game.NotifyUtil.on(ENotifyType.BLOCK_INPUT_HIDE, this.hideBlockInput, this);
        //
        Game.SceneManager.setSceneRootNode(this.sceneRootNode);
        Game.PopViewManager.setPopViewRootNode(this.popViewRootNode);
        // 载入 Home 场景
        await Game.SceneManager.gotoScene({
            sceneName: ESceneName.HOME,
            resDirs: ["home"],
            prefabUrl: "home/prefab/Home",
        });
        cc.tween(this.LoadingNode)
            .to(0.2, { opacity: 0 })
            .call(() => this.LoadingNode.active = false)
            .start();
    }

    private async gameSetup() {
        await Game.StorageUtil.setup();
        await Game.GameUtil.setup();
        await Game.LocalizeUtil.setup();
        await Game.NotifyUtil.setup();
        await Game.AudioManager.setup();
        await Game.PopViewManager.setup();
    }

    private showBlockInput(reason: string) {
        this.blockInputRefNum += 1;
        this.blockReasons.push(reason);
        this.updateBlockInput();
        console.log("blockinput block:", this.blockInputRefNum, reason);
    }

    private hideBlockInput(reason: string) {
        this.blockInputRefNum -= 1;
        this.blockReasons.splice(this.blockReasons.findIndex((o) => o === reason), 1);
        this.updateBlockInput();
        console.log("blockinput allow:", this.blockInputRefNum, reason);
    }

    private updateBlockInput() {
        this.blockInputNode.active = this.blockInputRefNum > 0;
        if (!TEST) {
            return;
        }
        this.blockStateLabel.string = this.blockReasons.join("\n");
    }
}
