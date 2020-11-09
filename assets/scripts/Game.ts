import AudioManager from "./Manager/AudioManager";
import PopViewManager from "./Manager/PopViewManager";
import GameUtil from "./Utils/GameUtil";
import LocalizeUtil from "./Utils/LocalizeUtil";
import NotifyUtil from "./Utils/NotifyUtil";
import StorageUtil from "./Utils/StorageUtil";

export default class Game {
    /** 音频管理器 */
    public static get AudioManager(): AudioManager {
        return AudioManager.getInstance();
    }
    /** PopView 管理器 */
    public static get PopViewManager(): PopViewManager {
        return PopViewManager.getInstance();
    }

    public static get GameUtil(): GameUtil {
        return GameUtil.getInstance();
    }

    public static get LocalizeUtil(): LocalizeUtil {
        return LocalizeUtil.getInstance();
    }

    public static get NotifyUtil(): NotifyUtil {
        return NotifyUtil.getInstance();
    }

    public static get StorageUtil(): StorageUtil {
        return StorageUtil.getInstance();
    }
}
