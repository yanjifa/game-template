
import { Color, Component, Label, Node, SpriteComponent, tween, _decorator } from 'cc';
import { ENotifyType, ESceneName } from './Enum';
import Game from './Game';
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
        window['Game'] = Game;
        // 加载动画顶层遮罩
        this.LoadingNode.active = true;
        tween(this.loadAnimNode).by(0.1, { angle: -40 }).repeatForever().start();
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
            resDirs: ['home'],
            prefabUrl: 'home/prefab/Home',
        });
        tween(this.LoadingNode.getComponent(SpriteComponent))
            .to(0.2, { color: new Color(255, 255, 255, 0) })
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
