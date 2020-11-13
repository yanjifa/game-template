import Bluebird = require("bluebird");
import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    protected onLoad() {
        window["Game"] = Game;
    }

    protected async start() {
        await this.gameSetup();
        await Bluebird.fromCallback((callback) => {
            cc.resources.load<cc.Prefab>("localizeCase/LocalizeCase", (error, prefab) => {
                const node = cc.instantiate(prefab);
                node.parent = this.node;
                callback(error);
            });
        });
    }

    private async gameSetup() {
        await Game.GameUtil.setup();
        await Game.LocalizeUtil.setup();
        await Game.NotifyUtil.setup();
        await Game.StorageUtil.setup();
        await Game.AudioManager.setup();
        await Game.PopViewManager.setup();
    }
}
