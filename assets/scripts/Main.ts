
import { Color, Component, Label, Node, SpriteComponent, tween, _decorator } from 'cc';
import { ENotifyType, ESceneName } from './Enum';
import AppGame from './AppGame';
const { ccclass, property } = _decorator;

const TEST = true;

@ccclass('Main')
export class Main extends Component {
    @property(Node)
    private sceneRootNode: Node = null;

    @property(Node)
    private popViewRootNode: Node = null;

    @property(Node)
    private blockInputNode: Node = null;

    @property(Node)
    private blockRedDot: Node = null;

    @property(Label)
    private blockStateLabel: Label = null;

    @property(Node)
    private LoadingNode: Node = null;

    @property(Node)
    private loadAnimNode: Node = null;

    private blockInputRefNum = 0;

    private blockReasons: string[] = [];

    protected onLoad() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).Game = AppGame;
        // 加载动画顶层遮罩
        this.LoadingNode.active = true;
        tween(this.loadAnimNode).by(0.1, { angle: -40 }).repeatForever().start();
        //
        this.updateBlockInput();
        this.blockRedDot.active = TEST;
        this.blockStateLabel.node.active = TEST;
    }

    protected onDestroy() {
        AppGame.NotifyUtil.off(ENotifyType.BLOCK_INPUT_SHOW, this.showBlockInput, this);
        AppGame.NotifyUtil.off(ENotifyType.BLOCK_INPUT_HIDE, this.hideBlockInput, this);
    }

    protected async start() {
        await this.gameSetup();
        AppGame.NotifyUtil.on(ENotifyType.BLOCK_INPUT_SHOW, this.showBlockInput, this);
        AppGame.NotifyUtil.on(ENotifyType.BLOCK_INPUT_HIDE, this.hideBlockInput, this);
        //
        AppGame.SceneManager.setSceneRootNode(this.sceneRootNode);
        AppGame.PopViewManager.setPopViewRootNode(this.popViewRootNode);
        // 载入 Home 场景
        await AppGame.SceneManager.gotoScene({
            sceneName: ESceneName.HOME,
            resDirs: ['home'],
            prefabUrl: 'home/prefab/Home',
        });
        tween(this.LoadingNode.getComponent(SpriteComponent))
            .to(0.2, { color: new Color(255, 255, 255, 0) })
            .call(() => this.LoadingNode.active = false)
            .start();
    }

    private async gameSetup() {
        await AppGame.StorageUtil.setup();
        await AppGame.GameUtil.setup();
        await AppGame.LocalizeUtil.setup();
        await AppGame.NotifyUtil.setup();
        await AppGame.AudioManager.setup();
        await AppGame.PopViewManager.setup();
    }

    private showBlockInput(reason: string) {
        this.blockInputRefNum += 1;
        this.blockReasons.push(reason);
        this.updateBlockInput();
        console.log('blockinput block:', this.blockInputRefNum, reason);
    }

    private hideBlockInput(reason: string) {
        this.blockInputRefNum -= 1;
        this.blockReasons.splice(this.blockReasons.findIndex((o) => o === reason), 1);
        this.updateBlockInput();
        console.log('blockinput allow:', this.blockInputRefNum, reason);
    }

    private updateBlockInput() {
        this.blockInputNode.active = this.blockInputRefNum > 0;
        if (!TEST) {
            return;
        }
        this.blockStateLabel.string = this.blockReasons.join('\n');
    }
}
