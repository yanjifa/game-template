/* eslint-disable no-multi-spaces */

/**
 * 支持的语言类型
 *
 * @export
 * @enum {number}
 */
export enum ELanguageType {
    EN = "en",   // 英文
    ZH = "zh"    // 中文
}

/**
 * 存档 key
 *
 * @export
 * @enum {number}
 */
export enum EStorageKey {
    LANGUAGE = "LANGUAGE",   // 语言存档
}

/**
 * 通知类型
 *
 * @export
 * @enum {number}
 */
export enum ENotifyType {
    LANGUAGE_CHANGED = "LANGUAGE_CHANGED",   // 语言变更
    BLOCK_INPUT_SHOW = "BLOCK_INPUT_SHOW",   // active block input
    BLOCK_INPUT_HIDE = "BLOCK_INPUT_HIDE",   // disable block input
    SWITCH_SCENE     = "SWITCH_SCENE",       // 切换场景
}

/**
 * 场景名称
 *
 * @export
 * @enum {number}
 */
export enum ESceneName {
    HOME = "HOME", // 主场景
}

/**
 * popview 名称
 *
 * @export
 * @enum {number}
 */
export enum EViewName {
    SETTING        = "SETTING",          // 设置界面
    LIST_VIEW_DEMO = "LIST_VIEW_DEMO",   // listview 示范
}
