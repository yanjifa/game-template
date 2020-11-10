import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {



    protected onLoad() {
        (window as any).Game = Game;
    }

    protected start() {
        this.gameSetup().then(() => {
            console.info("gameSetup success");
        }).catch((e) => {
            console.error("gameSetup fail", e);
        });
    }

    private async gameSetup() {
        await Game.AudioManager.setup();
        await Game.PopViewManager.setup();
        await Game.GameUtil.setup();
        await Game.LocalizeUtil.setup();
        await Game.NotifyUtil.setup();
        await Game.StorageUtil.setup();
    }
}
