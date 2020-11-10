import AudioManager from "./Manager/AudioManager";
import PopViewManager from "./Manager/PopViewManager";
import GameUtil from "./Util/GameUtil";
import LocalizeUtil from "./Util/LocalizeUtil";
import NotifyUtil from "./Util/NotifyUtil";
import StorageUtil from "./Util/StorageUtil";

export default class Game {
    /** 音频管理器 */
    public static get AudioManager(): AudioManager {
        return AudioManager.getInstance();
    }
    /** PopView 管理器 */
    public static get PopViewManager(): PopViewManager {
        return PopViewManager.getInstance();
    }
    /** 游戏工具类 */
    public static get GameUtil(): GameUtil {
        return GameUtil.getInstance();
    }
    /** 多语言工具类 */
    public static get LocalizeUtil(): LocalizeUtil {
        return LocalizeUtil.getInstance();
    }
    /** 全局通知工具 */
    public static get NotifyUtil(): NotifyUtil {
        return NotifyUtil.getInstance();
    }
    /** 客户端存档工具 */
    public static get StorageUtil(): StorageUtil {
        return StorageUtil.getInstance();
    }
}
