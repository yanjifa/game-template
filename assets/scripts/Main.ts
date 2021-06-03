import { ENotifyType, ESceneName } from "./Enum";
import Game from "./Game";

const {ccclass, property} = cc._decorator;

const TEST = true;

@ccclass
export default class Main extends cc.Component {
    @property(cc.Camera)
    private mainCamera: cc.Camera = null;

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

    @property(cc.Sprite)
    private effectSprite: cc.Sprite = null;

    private blockInputRefNum = 0;

    private blockReasons: string[] = [];

    private renderTexture: cc.RenderTexture = null;

    private renderSpriteFrame: cc.SpriteFrame = null;

    private effectState = false;

    protected onLoad() {
        window["Game"] = Game;
        // 加载动画顶层遮罩
        this.LoadingNode.active = true;
        cc.tween(this.loadAnimNode).by(0.1, { angle: -40 }).repeatForever().start();
        //
        this.updateBlockInput();
        this.blockRedDot.active = TEST;
        this.blockStateLabel.node.active = TEST;
        //
        this.renderTexture = new cc.RenderTexture();
        this.renderTexture.initWithSize(cc.winSize.width, cc.winSize.height);
        this.renderTexture.setFlipY(true);
        this.renderTexture.setPremultiplyAlpha(true);
        this.renderSpriteFrame = new cc.SpriteFrame();
        this.renderSpriteFrame.setTexture(this.renderTexture);
        this.effectSprite.spriteFrame = this.renderSpriteFrame;
    }

    protected onDestroy() {
        Game.NotifyUtil.off(ENotifyType.BLOCK_INPUT_SHOW, this.showBlockInput, this);
        Game.NotifyUtil.off(ENotifyType.BLOCK_INPUT_HIDE, this.hideBlockInput, this);
        Game.NotifyUtil.off(ENotifyType.CAMEAR_EFFECT, this.cameraEffect, this);
    }

    protected async start() {
        await this.gameSetup();
        Game.NotifyUtil.on(ENotifyType.BLOCK_INPUT_SHOW, this.showBlockInput, this);
        Game.NotifyUtil.on(ENotifyType.BLOCK_INPUT_HIDE, this.hideBlockInput, this);
        Game.NotifyUtil.on(ENotifyType.CAMEAR_EFFECT, this.cameraEffect, this);
        //
        Game.SceneManager.setSceneRootNode(this.sceneRootNode);
        Game.PopViewManager.setPopViewRootNode(this.popViewRootNode);
        // 载入 Home 场景
        // await Game.SceneManager.gotoScene({
        //     sceneName: ESceneName.HOME,
        //     resDirs: ["home"],
        //     prefabUrl: "home/prefab/Home",
        // });
        await Game.SceneManager.gotoScene({
            sceneName: ESceneName.SHARE,
            resDirs: ["share"],
            prefabUrl: "share/prefab/Share",
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

    private cameraEffect() {
        this.effectState = !this.effectState;
        if (this.effectState) {
            this.effectSprite.node.active = true;
            this.mainCamera.targetTexture = this.renderTexture;
        } else {
            this.mainCamera.targetTexture = null;
            this.effectSprite.node.active = false;
        }
    }
}
